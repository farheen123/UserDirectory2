using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Data;
using UserDirectory.Api.DTOs;
using UserDirectory.Api.Models;

namespace UserDirectory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IValidator<CreateUserRequest> _createValidator;
    private readonly IValidator<UpdateUserRequest> _updateValidator;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        AppDbContext db,
        IValidator<CreateUserRequest> createValidator,
        IValidator<UpdateUserRequest> updateValidator,
        ILogger<UsersController> logger)
    {
        _db = db;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = logger;
    }

    /// <summary>Get all users</summary>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<UserResponse>), 200)]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetAll()
    {
        var users = await _db.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => ToResponse(u))
            .ToListAsync();

        return Ok(users);
    }

    /// <summary>Get a single user by ID</summary>
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(UserResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<UserResponse>> GetById(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user is null)
            return NotFound(new { message = $"User with ID {id} not found." });

        return Ok(ToResponse(user));
    }

    /// <summary>Create a new user</summary>
    [HttpPost]
    [ProducesResponseType(typeof(UserResponse), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<UserResponse>> Create([FromBody] CreateUserRequest request)
    {
        var validation = await _createValidator.ValidateAsync(request);
        if (!validation.IsValid)
            return BadRequest(new { errors = validation.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }) });

        var user = new User
        {
            Name = request.Name.Trim(),
            Age = request.Age,
            City = request.City.Trim(),
            State = request.State.Trim(),
            Pincode = request.Pincode.Trim(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Created user {Id} - {Name}", user.Id, user.Name);

        return CreatedAtAction(nameof(GetById), new { id = user.Id }, ToResponse(user));
    }

    /// <summary>Update an existing user</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(UserResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<UserResponse>> Update(int id, [FromBody] UpdateUserRequest request)
    {
        var validation = await _updateValidator.ValidateAsync(request);
        if (!validation.IsValid)
            return BadRequest(new { errors = validation.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }) });

        var user = await _db.Users.FindAsync(id);
        if (user is null)
            return NotFound(new { message = $"User with ID {id} not found." });

        user.Name = request.Name.Trim();
        user.Age = request.Age;
        user.City = request.City.Trim();
        user.State = request.State.Trim();
        user.Pincode = request.Pincode.Trim();
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        _logger.LogInformation("Updated user {Id} - {Name}", user.Id, user.Name);

        return Ok(ToResponse(user));
    }

    /// <summary>Delete a user</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user is null)
            return NotFound(new { message = $"User with ID {id} not found." });

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Deleted user {Id}", id);

        return NoContent();
    }

    private static UserResponse ToResponse(User u) =>
        new(u.Id, u.Name, u.Age, u.City, u.State, u.Pincode, u.CreatedAt, u.UpdatedAt);
}
