from flask.cli import AppGroup
from .users import seed_users, undo_users
from .products import seed_products, undo_products

from .reviews import seed_reviews, undo_reviews
from app.seeds.wishlists import seed_wishlists, undo_wishlists

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_wishlists()
        undo_reviews()
        undo_products()
        undo_users()
    else:
        # Always clear existing data before seeding to prevent constraint violations
        # This ensures clean seeding in both development and production environments
        undo_wishlists()
        undo_reviews()
        undo_products()
        undo_users()
    # Correct seeding order: users -> products -> reviews -> wishlists
    seed_users()
    product_ids = seed_products()
    seed_reviews(product_ids)
    seed_wishlists()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_wishlists()
    undo_reviews()

    undo_products()
    undo_users()
