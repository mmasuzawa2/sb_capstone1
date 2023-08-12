from flask import Flask, redirect, render_template, jsonify, request, session,flash,Markup,url_for
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from models import *
from api_access import *
from forms import *
import re


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///events'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "mokomichi1"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['TESTING'] = False

debug = DebugToolbarExtension(app)

with app.app_context():
    if app.config['TESTING'] == False:
        connect_db(app)
         
    # db.drop_all()
    # db.create_all()

             


@app.route("/")
def root():
    if session.get('userid'):
        username = session['userid']
        return render_template('index.html',username=username)
    else:
        return redirect('/register')


@app.route("/search")
def event_search():
    word = request.args["evt_search"]
    loc = request.args["loc_search"]

    if bool(re.match('^[0-9]+$', loc)):
        res = tm_search(zip=loc,city=None,state=None,word=word)
    else:
        addr = loc.split(", ")
        res = tm_search(zip=None,city=addr[0],state=addr[1],word=word)


    if res["page"]["totalElements"] < 1:
        return render_template('no-result.html', word=word,loc=loc)
    else:
        data = res["_embedded"]["events"]
        return render_template('search.html', data=data)
    
    

@app.route("/add_event", methods=["POST"])
def event_add():

    data = request.get_json()
    
    event_name = data["title"]
    event_time = data["time"]
    event_date = data["date"]
    
    event = Events(name=event_name,date=event_date,time=event_time,userid=session['userid'])

    
    db.session.add(event)
    db.session.commit()


    return jsonify({'result': "event added"}), 200


@app.route("/add_tm_event", methods=["POST"])
def event_add_tm():
    
    event_name = request.form["event_name"]
    event_time = request.form["event_time_from"]
    event_date = request.form["event_date"]
    
    event = Events(name=event_name,date=event_date,time=event_time,userid=session['userid'])

    
    db.session.add(event)
    db.session.commit()

    flash("event added to your calendar")

    return redirect('/')



@app.route("/return_events")
def return_event():

    userid = session['userid']

    events = Events.query.filter_by(userid=userid)
    
    eventsarr = [e.serialize() for e in events]
    return eventsarr

    

@app.route("/delete_event", methods=["DELETE"])
def delete_event():
    date = request.args["date"]
    name =request.args["title"]
    userid = session['userid']

    Events.query.filter_by(userid=userid).filter_by(name=name).filter(Events.date==date).delete()
    db.session.commit()

    return jsonify({'result': "event deleted"}), 200
    


@app.route("/register" , methods=["GET", "POST"])
def register():     
    Regform = RegisterForm()
    Logform = LoginForm()

       
    if Regform.validate_on_submit():
        username = Regform.username.data
        password = Regform.password.data
    
        try:
            user = Users.register(username,password)
            db.session.add(user)
            db.session.commit()

            session['userid'] = username
            return redirect('/')
        
        except IntegrityError:
            flash("username is taken.")
            return render_template('login.html', Regform=Regform,Logform=Logform)

    else:
        return render_template('login.html', Regform=Regform,Logform=Logform)
    

@app.route("/login" , methods=["GET", "POST"])
def login(): 
    Regform = RegisterForm()
    Logform = LoginForm()

    if Logform.validate_on_submit():
        username = Logform.username.data
        password = Logform.password.data

        user = Users.authenticate(username,password)

        if user == False:
            flash("username or password is invalid.")
            return render_template('login.html', Regform=Regform,Logform=Logform)
        else:
            session['userid'] = username
            return redirect('/')

    else:
        return render_template('login.html', Regform=Regform,Logform=Logform)
    



@app.route("/logout")
def logout():
    session.pop("userid")
    flash("logged out")
    return redirect('/')