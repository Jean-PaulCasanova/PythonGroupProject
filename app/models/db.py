from flask_sqlalchemy import SQLAlchemy

import os
environment = os.getenv("FLASK_ENV")
# If no FLASK_ENV is set but we have a SCHEMA, assume production
if not environment and os.getenv("SCHEMA"):
    environment = "production"
SCHEMA = os.environ.get("SCHEMA")


db = SQLAlchemy()

# helper function for adding prefix to foreign key column references in production
def add_prefix_for_prod(attr):
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    else:
        return attr
