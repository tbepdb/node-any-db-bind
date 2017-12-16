import { createPool, Queryable, Connection, ConnectionPool, PoolConfig, ConnectOpts, ResultSet, Query } from 'any-db';

declare function wrap(db: wrap.IAnyDb): wrap.IAnyDbBind;
declare namespace wrap {
  interface QueryableBind {
    query(text: string, params?: any, callback?: (error: Error, results: ResultSet) => void): Query
  }

  interface ConnectionPoolBind {
    query(text: string, params?: any, callback?: (error: Error, results: ResultSet) => void): Query
    acquire(callback: (error: Error, result: Connection) => void): void;
    release(connection: Connection): void;
    close(callback?: (error: Error) => void): void;
  }

  interface IAnyDbBind {
    createConnection(url: string, callback?: (error: Error, connection: Connection) => void): QueryableBind;
    createConnection(opts: ConnectOpts, callback?: (error: Error, connection: Connection) => void): QueryableBind;
    createPool(url: string, config: PoolConfig): ConnectionPoolBind;
    createPool(opts: ConnectOpts, config: PoolConfig): ConnectionPoolBind;
  }

  interface IAnyDb {
    createConnection(url: string, callback?: (error: Error, connection: Connection) => void): Connection;
    createConnection(opts: ConnectOpts, callback?: (error: Error, connection: Connection) => void): Connection;
    createPool(url: string, config: PoolConfig): ConnectionPool;
    createPool(opts: ConnectOpts, config: PoolConfig): ConnectionPool;
  }
  function wrapConnect(conn: Queryable): QueryableBind;
}

export = wrap;
