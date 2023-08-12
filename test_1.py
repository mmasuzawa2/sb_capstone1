from unittest import TestCase
from app import app
from models import *
import json
from flask import session



app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///events-test'
app.config['WTF_CSRF_ENABLED'] = False


with app.app_context():
    connect_db(app)
    # db.drop_all()
    # db.create_all()


user_data = {
    "username": "testuser",
    "password": "password"
}


event_data = {
    "title": "test event 1",
    "date": "September 1, 2023",
    "time": "18:00:00",
}

with app.test_client() as client:
            with client.session_transaction() as sess:
                sess["userid"] = user_data["username"]


class FlaskTests(TestCase):

    def setUp(self):
        self.client = app.test_client()


    def tearDown(self):
        """Clean up fouled transactions."""
        with app.app_context():
            db.session.rollback()


    def test_register_user(self):
        with app.app_context():
            Users.query.delete()
            db.session.commit()
       
        res = self.client.post('/register',
                               data=user_data,
                               follow_redirects=True)

        html = res.get_data(as_text=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn("testuser", html)


    
    def test_add_form_event(self):
        with app.app_context():
            Events.query.delete()
            db.session.commit()

        res = self.client.post("/add_event", 
                               data = json.dumps(event_data), 
                               content_type='application/json',
                               follow_redirects=True)
        
        html = res.get_data(as_text=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn("test event 1", html)



    def test_search_api(self):
        query = {
              "evt_search" : "blahblahblah",
              "loc_search" : "Atlanta, GA"
        }

        res = self.client.get("/search",
                               query_string = query,
                               follow_redirects=True)
         
        html = res.get_data(as_text=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn("No results", html)






    

    