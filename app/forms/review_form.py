from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField
from wtforms.validators import DataRequired, Length, NumberRange

class ReviewForm(FlaskForm):
    rating = IntegerField(
        'Rating',
        validators=[
            DataRequired(message='Rating is required.'),
            NumberRange(min=1, max=5, message='Rating must be between 1 and 5.')
        ])
    title = StringField(
        'Title',
        validators=[
            DataRequired(message='Title is required.'),
            Length(max=100, message='Title must be under 100 characters long.')
        ])
    content = TextAreaField(
        'Content',
        validators=[
            DataRequired(message='Content is required.'),
            Length(max=500, message='Content must be under 500 characters long.')
<<<<<<< HEAD
        ])
=======
        ])
>>>>>>> origin/dev-main-updates
