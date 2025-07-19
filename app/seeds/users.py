from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
# def seed_users():
#     demo = User(
#         username='chris',
#         email='chris@chris.com',
#         password='password',
#         first_name='Chris',
#         last_name='Rios',
#         profile_image_url='https://example.com/demo.jpg'  # optional
#     )
#     marnie = User(
#         username='jean',
#         email='jean@jean.com',
#         password='password',
#         first_name='Jean',
#         last_name='Casanova',
#         profile_image_url='https://example.com/marnie.jpg'
#     )
#     bobbie = User(
#         username='jose',
#         email='jose@jose.com',
#         password='password',
#         first_name='Jose',
#         last_name='Garcia',
#         profile_image_url='https://example.com/bobbie.jpg'
#     )

#     db.session.add_all([demo, marnie, bobbie])
#     db.session.commit()


def seed_users():
    chris = User(
        username='chris',
        email='chris@chris.com',
        password='password',
        first_name='Chris',
        last_name='Rios',
        profile_image_url='https://example.com/demo.jpg'
    )
    jean = User(
        username='jean',
        email='jean@jean.com',
        password='password',
        first_name='Jean',
        last_name='Casanova',
        profile_image_url='https://example.com/marnie.jpg'
    )
    jose = User(
        username='jose',
        email='jose@jose.com',
        password='password',
        first_name='Jose',
        last_name='Garcia',
        profile_image_url='https://example.com/bobbie.jpg'
    )
    east = User(
        username='east',
        email='east@east.com',
        password='password',
        first_name='East',
        last_name='Allen',
        profile_image_url='https://example.com/east.jpg'
    )

    db.session.add_all([chris, jean, jose, east])
    db.session.commit()




# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
