
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

// Xac dinh vi tri ma nguon sau khi build.
const candidates = [
  'dist/modules/audit-log',
  'dist/src/modules/audit-log',
];

const buildDir = candidates
  .map((dir) => path.resolve(__dirname, dir))
  .find((dir) =>
    fs.existsSync(path.join(dir, 'audit-log.service.js')),
  );

assert.ok(buildDir, 'AuditLogService build not found');

// Gia lap DatabaseService de khong nap cau hinh DB that.
const dbPath = require.resolve(
  path.join(buildDir, '../../database/database.service.js'),
);

require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: {
    DatabaseService: class DatabaseService {},
  },
};

const { AuditLogService } = require(
  path.join(buildDir, 'audit-log.service.js'),
);

const userId = '11111111-1111-4111-8111-111111111111';

const expectedSql = `
  INSERT INTO audit_logs (
    user_id,
    username,
    case_id,
    action,
    result,
    ip_address
  )
  VALUES ($1, $2, NULL, $3, $4, $5)
`;

const normalizeSql = (sql) =>
  sql.replace(/\s+/g, ' ').trim();

function createMockDatabase() {
  const calls = [];

  return {
    calls,
    async query(sql, params) {
      calls.push({ sql, params });
      return [];
    },
  };
}

const cases = [
  {
    name: 'TC01 - Login success',
    input: {
      userId,
      username: 'admin',
      action: 'LOGIN',
      result: 'SUCCESS',
      ipAddress: '127.0.0.1',
    },
    expected: [
      userId, 'admin', 'LOGIN', 'SUCCESS', '127.0.0.1',
    ],
  },
  {
    name: 'TC02 - Wrong password',
    input: {
      userId,
      username: 'admin',
      action: 'LOGIN',
      result: 'FAILED',
      ipAddress: '127.0.0.1',
    },
    expected: [
      userId, 'admin', 'LOGIN', 'FAILED', '127.0.0.1',
    ],
  },
  {
    name: 'TC03 - Unknown account',
    input: {
      userId: null,
      username: 'unknown_user',
      action: 'LOGIN',
      result: 'FAILED',
      ipAddress: null,
    },
    expected: [
      null, 'unknown_user', 'LOGIN', 'FAILED', null,
    ],
  },
  {
    name: 'TC04 - Logout success',
    input: {
      userId,
      username: 'admin',
      action: 'LOGOUT',
      result: 'SUCCESS',
      ipAddress: '127.0.0.1',
    },
    expected: [
      userId, 'admin', 'LOGOUT', 'SUCCESS', '127.0.0.1',
    ],
  },
];

for (const item of cases) {
  test(item.name, async () => {
    const db = createMockDatabase();
    const service = new AuditLogService(db);

    await service.record(item.input);

    assert.equal(db.calls.length, 1);

    assert.equal(
      normalizeSql(db.calls[0].sql),
      normalizeSql(expectedSql),
    );

    assert.deepEqual(
      db.calls[0].params,
      item.expected,
    );
  });
}

test('TC05 - Database error propagation', async () => {
  const dbError = new Error('Simulated database failure');

  const db = {
    async query() {
      throw dbError;
    },
  };

  const service = new AuditLogService(db);

  await assert.rejects(
    () => service.record(cases[0].input),
    (error) => error === dbError,
  );
});
