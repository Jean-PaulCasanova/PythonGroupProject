from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text



def seed_users():
    chris = User(
        username='chris',
        email='chris@chris.com',
        first_name='Chris',
        last_name='Rios',
        profile_image_url='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0yNSA3NWMwLTEzLjggMTEuMi0yNSAyNS0yNXMyNSAxMS4yIDI1IDI1SDE1eiIgZmlsbD0iIzljYTNhZiIvPgo8L3N2Zz4='
    )
    chris.password = 'password'
    jean = User(
        username='jean',
        email='jean@jean.com',
        first_name='Jean',
        last_name='Casanova',
        profile_image_url='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0yNSA3NWMwLTEzLjggMTEuMi0yNSAyNS0yNXMyNSAxMS4yIDI1IDI1SDE1eiIgZmlsbD0iIzljYTNhZiIvPgo8L3N2Zz4='
    )
    jean.password = 'password'
    jose = User(
        username='jose',
        email='jose@jose.com',
        first_name='Jose',
        last_name='Garcia',
        profile_image_url='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0yNSA3NWMwLTEzLjggMTEuMi0yNSAyNS0yNXMyNSAxMS4yIDI1IDI1SDE1eiIgZmlsbD0iIzljYTNhZiIvPgo8L3N2Zz4='
    )
    jose.password = 'password'
    east = User(
        username='east',
        email='east@east.com',
        first_name='East',
        last_name='Allen',
        profile_image_url='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0yNSA3NWMwLTEzLjggMTEuMi0yNSAyNS0yNXMyNSAxMS4yIDI1IDI1SDE1eiIgZmlsbD0iIzljYTNhZiIvPgo8L3N2Zz4='
    )
    east.password = 'password'

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
