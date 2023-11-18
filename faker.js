
// Import the necessary MongoDB packages
const MongoClient = require('mongodb').MongoClient;

// Connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = 'your_database_name';

// Connect to MongoDB
MongoClient.connect(url, function(err, client) {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
    }

    console.log('Connected to MongoDB');

    // Get the database
    const db = client.db(dbName);

    // Get the collection of apps
    const appsCollection = db.collection('apps');

    // Find all the apps
    appsCollection.find({}).toArray(function(err, apps) {
        if (err) {
            console.error('Failed to fetch apps:', err);
            client.close();
            return;
        }

        // Loop through each app
        apps.forEach(function(app) {
            // Push the user ID to the app
            app.userId = 'your_user_id';

            // Update the app in the database
            appsCollection.updateOne({ _id: app._id }, { $set: { userId: app.userId } }, function(err, result) {
                if (err) {
                    console.error('Failed to update app:', err);
                } else {
                    console.log('Updated app:', app._id);
                }
            });
        });

        // Close the MongoDB connection
        client.close();
    });
});
