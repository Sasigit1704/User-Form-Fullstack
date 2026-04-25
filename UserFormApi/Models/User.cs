using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserFormApi.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string CountryCode { get; set; } = "";
        public string Gender { get; set; } = "";
        public string? ProfilePath { get; set; }
    }
}