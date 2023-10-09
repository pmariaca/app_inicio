from models import Category, Element
from collections import OrderedDict
from config import db
from var_dump import var_dump


def readCatalog():
    try:

        catalog = Category.query.add_columns(Element).outerjoin(Element).all()
        cat = list(map(lambda t: t[0], catalog))
        elm = list(map(lambda t: t[1], catalog))
        cat = list(OrderedDict.fromkeys(cat))

        lst = []
        for rowC in cat:
            tm = []
            for row in elm:
                if row != None and rowC.id == row.id_category:
                    strSql = row.content
                    strSql = strSql.replace("&amp;#92;", "\\\\")
                    strSql = strSql.replace("&amp;#182;", "\\n")
                    strSql = strSql.replace("&#92;", "\\\\")
                    strSql = strSql.replace("&#182;", "\\n")
                    strSql = strSql.replace("\'", "\\'")  
                    strSql = strSql.replace('&quot;', '"')              
                    tmt = [row.id, row.title, strSql]
                    tm.append(tmt)
            lst.append([rowC.id, rowC.title, tm])

        return (lst)
    except Exception as error:
        return ({'error': error.args})
    

def addGroup(nameGroup):
    try:
        category = Category(title=nameGroup)
        db.session.add(category)
        db.session.commit()
        return 'ok'
    except Exception as error:
        return ({'error': error.args})


def delGroup(res):
    try:
        grp = []
        elem = []
        for r in res.keys():
            rr = r.split('_')
            if rr[0] == 'grp':
                grp.append(rr[1])
            elif rr[0] == 'itemGrp':
                elem.append(rr[2])

        if elem:
            db.session.query(Element).filter(Element.id.in_(elem)).delete()
            db.session.commit()
        for x in grp:
            db.session.query(Element).filter(Element.id_category == x).delete()
            db.session.commit()
            category = db.session.get(Category, x)
            db.session.delete(category)
            db.session.commit()
        return 'ok'
    except Exception as error:
        return ({'error': error.args})


def addItemGroup(res):
    try:
        title = res['name'].strip()
        strSql = res['strSql'].strip()
        strSql = strSql.replace("\\", "&#92;")
        strSql = strSql.replace('"', '&quot;')
        strSql = strSql.replace("'", "\'")
        strSql = strSql.replace("\r\n", "&#182;")
        strSql = strSql.replace("\n", "&#182;")

        element = Element(
            id_category=res['addRadio'], title=title, content=strSql)
        db.session.add(element)
        db.session.commit()
        return 'ok'
    except Exception as error:
        return ({'error': error.args})
