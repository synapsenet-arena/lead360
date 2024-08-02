#!/bin/sh

# Check if the initialization has already been done and that we enabled automatic migration
if [ "${ENABLE_DB_MIGRATIONS}" = "true" ] && [ ! -f /app/docker-data/db_status ]; then
    echo "Running database setup and migrations..."

    # Run setup and migration scripts
    NODE_OPTIONS="--max-old-space-size=1500" npx ts-node ./scripts/setup-db.ts
    yarn database:migrate:prod

    # Mark initialization as done
    echo "Successfuly migrated DB!"
    touch /app/docker-data/db_status
fi


# Path to the flag file
FLAG_FILE="/app/.initialized"

# Check if the flag file exists
if [ ! -f "$FLAG_FILE" ]; then
    echo "Running initialization commands..."
    # Run your initialization commands here
    echo "yarn could not be found, installing... yarn"
    yarn

    echo "Running database setup and migrations..."
    npx nx database:init:prod twenty-server

    echo "#######################--Migrations and Schemas created successfully..#######################--"

    touch "$FLAG_FILE"
    
    echo "Initialization completed."
else
    echo "Initialization already completed. Skipping..."
fi

# Continue with the original Docker command
exec "$@"
