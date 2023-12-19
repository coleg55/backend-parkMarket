#!/bin/bash

# Database credentials
PGUSER="cole"
PGPASSWORD="55Willow!"
PGDATABASE="parkMarket-dev"

# Output file
BACKUP_FILE="./bin/backup_file.tar"

# Run pg_dump command
pg_dump -U $PGUSER -W -F t $PGDATABASE > $BACKUP_FILE

# Check if the backup was successful
if [ $? -eq 0 ]; then
  echo "Backup completed successfully."
else
  echo "Backup failed. Please check the error message."
fi
