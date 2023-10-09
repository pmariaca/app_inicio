import pymysql
from var_dump import var_dump

srv = None
usr = None
pwd = None
db = None
conn = None

def connect(ssrv, user, spwd, sdb=None):
    try:
        global srv, usr, pwd, db, conn
        conne = pymysql.connect(
            host=ssrv,
            user=user,
            password=spwd,
            db=sdb
        )
        srv = ssrv
        usr = user
        pwd = spwd
        db = sdb 
        conn = conne
        
        return True
    except Exception as error:
        print('connect--> ', error.args)
        return ({'error': error.args})


def testConnection_r(d):
    try:
        global srv, usr, pwd
        res = {}
        if d:
            for key in d:
                res[key] = d[key].strip()
            
        srv = res['srv']
        usr = res['usr']
        pwd = res['srv']
        connect(res['srv'], res['usr'], res['pwd'])
        if conn.open:
            conn.close()
        else:
            return getDB()
    except Exception as error:
        print('testConnection--> ',error.args)
        return ({'error': error.args}) # nop ?
    
def testConnection(res):
    try:
        global srv, usr, pwd
        srv = res['srv']
        usr = res['usr']
        pwd = res['srv']
        c = connect(res['srv'], res['usr'], res['pwd'])
        if conn.open:
            conn.close()
        else:
            return c
        return c
    except Exception as error:
        print('testConnection--> ',error.args)
        return ({'error': error.args}) # nop ?

def getDB():
    try:
        return mySql("SHOW databases")
    except Exception as error:
        print('getDB--> ',error.args)
        return error.args
        
def mySql(sql, origen=None):
    try:
        connect(srv, usr, pwd, db)
        return findQuery(sql, origen)
    except Exception as error:
        print('mySql--> ',error.args)
        return error.args
        
def findQuery(strSql, origen=None):
    if strSql.strip()=='':
        return
    try:
        cursor = conn.cursor()
        cursor.execute(strSql)
        rows = cursor.fetchall()
        row = [ i[0] for i in rows ] 
        info = [i[0] for i in cursor.description]
        #print('cursor.description: ',cursor.description)
        numRows = cursor.rownumber
        numCols = 1
        cursor.close()
        
        if origen==1:
            row = rows
            numCols = len(row)
        #==========================
        final = {}
        final['error'] = ''
        final['info'] = info
        final['numRows'] = numRows
        final['numCols'] = numCols
        final['row'] = row
        #==========================
        return final
    except Exception as error:
        print('findQuery--> ',error.args)
        return ({'error': error.args})

def getShowTables(selectDb):
    try:
        global db
        db = selectDb
        return mySql("SHOW tables")
    except Exception as error:
        print('getShowTables--> ',error.args)
        #return error.args
    

def getTblResult(strSql):
    try:
        return mySql(strSql,1)
    except Exception as error:
        print('getShowTables--> ',error.args)
        return error.args
    
    
    