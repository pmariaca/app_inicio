import config

from sqlalchemy import exc
from sqlalchemy.exc import DatabaseError
from sqlalchemy import Column, Date, Integer, MetaData, Table, Text, create_engine, select

import db_mysql as mysqldb
from flask import render_template, request, jsonify, flash, Response
from werkzeug.exceptions import abort, HTTPException
#from werkzeug.datastructures import ImmutableMultiDict
import json
from config import app
from models import Category, Element, db, category_schema, element_schema
from var_dump import var_dump



app = config.app

@app.errorhandler(500)
def internal_server_error(e):
    print('aaaaaaaaaajjjjjjjjjjjaaaaaaaaaaaaaa  222 nunca pasa por aqui')
    app.logger.exception(e)
    return render_template('500.html', title = '500'), 500



@app.errorhandler(404)
def page_not_found(error):
    print('aaaaaaaaaajjjjjjjjjjjaaaaaaaaaaaaaa  333')
    # poner donde se genere: abort(500)
    return render_template('404.html', title = '404'), 404

def prueba(r):
    print(r)

@app.route("/")
def index():   
    
    mensaje = 'jojojo'
    jsonify
    # catalog = db.session.query(Element, Category).join(Element, Category.id==Element.id_category, isouter=True)#.all()#.all()
    #catalog = db.session.query(Element, Category).outerjoin(Element).all()
    #catalog = db.session.query(Element, Category).outerjoin(Element)

    
    
    catalog = Category.query.add_columns(Element).outerjoin(Element).all()
    dic = dict(catalog)




    flash('rrrrrrrrrrrr or password')
    error = 'ssiiii'
    error = None
    
    return render_template("index.html", error=error, mensaje=mensaje, catalog=catalog, category=dic)


@app.post("/formnav")
def formnav():
    print('------  formnav   ==----')
    try:
        
        #=============
        # clean    
        res = {}
        d = dict(request.form)
        for key in d:
            res[key] = d[key].strip()
        #=============
        conn = mysqldb.test(res)
        var_dump(conn)
        app.register_error_handler(500, internal_server_error)
        #raise InvalidUsage(conn, status_code=410)
        # title = request.form.get("title")
        #print(request.form)
        

        

    except Exception:
        print('===>>> Exception- formnav--- <-')
        print(Exception)
    
    
    return render_template("form_nav.html")

class InvalidUsage(Exception):
    status_code = 400
    print('aaaaaaaaaajjjjjjjjjjjaaaaaaaaaaaaaa')
    def __init__(self, message, status_code=None, payload=None):
        print('+++++++++  rrrrrrrrrrrrrrrrr 1111 ++++++++++++++')
        print(message)
        print(self)
        
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        print('+++++++++  rrrrrrrrrrrrrrrrr 2222 ++++++++++++++')
        print(rv)
        return rv

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
    
# https://j2logo.com/tutorial-flask-leccion-5-base-de-datos-con-flask-sqlalchemy/
# https://flask-appbuilder.readthedocs.io/en/latest/multipledbs.html
