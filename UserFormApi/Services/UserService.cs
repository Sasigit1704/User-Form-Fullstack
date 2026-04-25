using MongoDB.Driver;
using UserFormApi.Models;

namespace UserFormApi.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDbSettings:ConnectionString"]);
            var database = client.GetDatabase(config["MongoDbSettings:DatabaseName"]);

            _users = database.GetCollection<User>(config["MongoDbSettings:CollectionName"]);
        }

        public void AddUser(User user)
        {
            _users.InsertOne(user);
        }

        public List<User> GetAllUsers()
        {
            return _users.Find(_ => true).ToList();
        }
    }
}