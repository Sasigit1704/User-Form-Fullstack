using Microsoft.AspNetCore.Mvc;
using UserFormApi.Models;
using UserFormApi.Services;

namespace UserFormApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]  
        public async Task<IActionResult> CreateUser([FromForm] User user, [FromForm] IFormFile? file)
        {
            if (user == null)
                return BadRequest("Invalid data");

            if (string.IsNullOrWhiteSpace(user.Name))
                return BadRequest("Name is required");

            if (!user.Email.Contains("@"))
                return BadRequest("Invalid email");

            if (user.Phone.Length != 10 || !user.Phone.All(char.IsDigit))
                return BadRequest("Phone must be 10 digits");

            if (string.IsNullOrWhiteSpace(user.Gender))
                return BadRequest("Gender required");

            if (file != null) {
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create)) {
                    await file.CopyToAsync(stream);
                }

                user.ProfilePath = file.FileName; // save file name
            }

            _userService.AddUser(user);

            return Ok(new { message = "User saved successfully", data = user });
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _userService.GetAllUsers();
            return Ok(users);
        }
    }
}