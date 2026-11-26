
require('reflect-metadata');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { randomUUID } = require('node:crypto');
const { Module } = require('@nestjs/common');
const { NestFactory } = require('@nestjs/core');

// Locate compiled backend source.
const root = ['dist', 'dist/src']
  .map((dir) => path.resolve(__dirname, dir))
  .find((dir) =>
    fs.existsSync(
      path.join(dir, 'modules/audit-log/audit-log.service.js'),
    ),
  );

assert.ok(root, 'Compiled backend not found');

const { DatabaseModule } = require(
  path.join(root, 'database/database.module.js'),
);
const { DatabaseService } = require(
  path.join(root, 'database/database.service.js'),
);
const { AuditLogModule } = require(
  path.join(root, 'modules/audit-log/audit-log.module.js'),
);
const { AuditLogService } = require(
  path.join(root, 'modules/audit-log/audit-log.service.js'),
);

// Initialize real NestJS dependency injection.
class IntegrationTestModule {}

Module({
  imports: [DatabaseModule, AuditLogModule],
})(IntegrationTestModule);

test('G13-038 - PostgreSQL integration', async () => {
  const app = await NestFactory.createApplicationContext(
    IntegrationTestModule,
    { logger: false, abortOnError: false },
  );

  try {
    const db = app.get(DatabaseService);
    const audit = app.get(AuditLogService);

    // Safety check: never write to the main database.
    const [identity] = await db.query(`
      SELECT current_database() AS db_name,
             current_user AS db_user
    `);

    assert.equal(identity.db_name, 'g13_038_test');
    assert.equal(identity.db_user, 'audit_test');

    const [user] = await db.query(
      'SELECT id, username FROM users WHERE username = $1',
      ['admin'],
    );

    assert.ok(user, 'Seed user admin not found');

    const before = await db.query(
      'SELECT id FROM audit_logs',
    );
    const beforeIds = new Set(before.map((row) => row.id));

    const [start] = await db.query(
      'SELECT clock_timestamp() AS ts',
    );

    const unknownUsername =
      'unknown_' + randomUUID().slice(0, 8);

    const base = {
      userId: user.id,
      username: user.username,
      ipAddress: '127.0.0.1',
    };

    const cases = [
      {
        ...base,
        action: 'LOGIN',
        result: 'SUCCESS',
      },
      {
        ...base,
        action: 'LOGIN',
        result: 'FAILED',
      },
      {
        userId: null,
        username: unknownUsername,
        action: 'LOGIN',
        result: 'FAILED',
        ipAddress: null,
      },
      {
        ...base,
        action: 'LOGOUT',
        result: 'SUCCESS',
      },
    ];

    // Write four audit records.
    for (const input of cases) {
      await audit.record(input);
    }

    const [end] = await db.query(
      'SELECT clock_timestamp() AS ts',
    );

    // Read the actual records from PostgreSQL.
    const allRows = await db.query(`
      SELECT id, user_id, username, case_id,
             action, result, ip_address, created_at
      FROM audit_logs
    `);

    const inserted = allRows.filter(
      (row) => !beforeIds.has(row.id),
    );

    assert.equal(inserted.length, 4);

    const expected = cases.map((item) =>
      JSON.stringify([
        item.userId,
        item.username,
        item.action,
        item.result,
        item.ipAddress,
        null,
      ]),
    ).sort();

    const actual = inserted.map((row) =>
      JSON.stringify([
        row.user_id,
        row.username,
        row.action,
        row.result,
        row.ip_address,
        row.case_id,
      ]),
    ).sort();

    assert.deepEqual(actual, expected);

    for (const row of inserted) {
      assert.match(
        row.id,
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );

      assert.ok(row.created_at instanceof Date);
      assert.ok(row.created_at >= start.ts);
      assert.ok(row.created_at <= end.ts);
    }

    console.table(inserted);
    console.log('PASS: Four audit records verified');
    console.log('PASS: UUID, timestamp and NULL values');

    // Verify foreign key constraint.
    await assert.rejects(
      () => audit.record({
        ...cases[0],
        userId: randomUUID(),
      }),
      (error) => error.code === '23503',
    );

    console.log('PASS: Foreign key constraint');

    // Verify result CHECK constraint.
    await assert.rejects(
      () => audit.record({
        ...cases[0],
        result: 'INVALID',
      }),
      (error) => error.code === '23514',
    );

    console.log('PASS: Result CHECK constraint');

    const finalRows = await db.query(
      'SELECT id FROM audit_logs',
    );

    assert.equal(finalRows.length, before.length + 4);

    console.log('PASS: Invalid records were not inserted');
    console.log('PASS: NestJS dependency injection');
    console.log('G13-038 INTEGRATION PASSED');
  } finally {
    await app.close();
  }
});
