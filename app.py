import config
import db_mysql as mysqldb
import catalog as cat

from flask import render_template, request, jsonify
from config import app

app = config.app


@app.route("/")
def index():
    catalog = cat.readCatalog()
    return render_template("index.html", catalog=catalog)


@app.post("/findServer")
def findServer():
    try:
        d = dict(request.form)
        res = {}
        if d:
            for key in d:
                res[key] = d[key].strip()
            conn = mysqldb.testConnection(res)
            if conn != True:
                return jsonify(
                    error=conn['error'][0],
                    message=conn['error'][1]
                )
            result = mysqldb.getDB()
    except Exception as error:
        print('findServer--> ', error.args)
        return error.args

    return jsonify(result)


@app.post("/getTables")
def getTables():
    selectDb = request.form['selectDb'].strip()
    result = mysqldb.getShowTables(selectDb)
    return jsonify(result)


@app.post("/resultSql")
def resultSql():
    strSql = request.form['strSql'].strip()
    res = mysqldb.getTblResult(strSql)
    return jsonify(res)


@app.post("/addGroup")
def addGroup():
    nameGroup = request.form['nameGroup'].strip()
    res = cat.addGroup(nameGroup)
    return jsonify(res)


@app.post("/delGroup")
def delGroup():
    res = dict(request.form)
    res = cat.delGroup(res)
    return jsonify(res)


@app.post("/addItemGroup")
def addItemGroup():
    res = dict(request.form)
    res = cat.addItemGroup(res)
    return jsonify(res)
