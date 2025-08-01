from flask.cli import AppGroup
from .users import seed_users, undo_users
<<<<<<< HEAD
from .reviews import seed_reviews, undo_reviews
=======
from .products import seed_products, undo_products
>>>>>>> origin/dev-main-updates

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
<<<<<<< HEAD
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_reviews()
        undo_users()
    seed_users()
    seed_reviews()
=======
    # Always clear existing data before seeding to prevent constraint violations
    # This ensures clean seeding in both development and production environments
    undo_products()
    undo_users()
    seed_users()
    seed_products()
    # Add other seed functions here
>>>>>>> origin/dev-main-updates


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
<<<<<<< HEAD
    undo_reviews()
=======
    undo_products()
>>>>>>> origin/dev-main-updates
    undo_users()
