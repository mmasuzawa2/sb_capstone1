from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired
    


class RegisterForm(FlaskForm):
    username = StringField("username",  validators=[InputRequired()], render_kw={"placeholder": "username"})
    password = PasswordField("password",  validators=[InputRequired()], render_kw={"placeholder": "password"})
    

class LoginForm(FlaskForm):
    username = StringField("username",  validators=[InputRequired()], render_kw={"placeholder": "username"})
    password = PasswordField("password",  validators=[InputRequired()], render_kw={"placeholder": "passsword"})