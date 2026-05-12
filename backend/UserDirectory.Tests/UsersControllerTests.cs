using FluentAssertions;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using UserDirectory.Api.Controllers;
using UserDirectory.Api.Data;
using UserDirectory.Api.DTOs;
using UserDirectory.Api.Validators;
using Xunit;

namespace UserDirectory.Tests;

public class UsersControllerTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly UsersController _sut;
    private readonly IValidator<CreateUserRequest> _createValidator = new CreateUserRequestValidator();
    private readonly IValidator<UpdateUserRequest> _updateValidator = new UpdateUserRequestValidator();

    public UsersControllerTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new AppDbContext(options);
        _sut = new UsersController(_db, _createValidator, _updateValidator, NullLogger<UsersController>.Instance);
    }

    // ── GET all ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_EmptyDb_ReturnsEmptyList()
    {
        var result = await _sut.GetAll();
        result.Value.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAll_WithUsers_ReturnsAll()
    {
        await CreateUser("Alice");
        await CreateUser("Bob");

        var result = await _sut.GetAll();
        result.Value.Should().HaveCount(2);
    }

    // ── GET by ID ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetById_ExistingId_ReturnsUser()
    {
        var created = await CreateUserViaController("Alice");
        var result = await _sut.GetById(created.Id);

        result.Value.Should().NotBeNull();
        result.Value!.Name.Should().Be("Alice");
    }

    [Fact]
    public async Task GetById_NonExistingId_Returns404()
    {
        var result = await _sut.GetById(999);
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    // ── POST ─────────────────────────────────────────────────────────────────

    [Fact]
    public async Task Create_ValidRequest_Returns201WithUser()
    {
        var request = new CreateUserRequest("Jane Doe", 30, "Sydney", "NSW", "2000");
        var result = await _sut.Create(request);

        var created = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var user = created.Value.Should().BeOfType<UserResponse>().Subject;
        user.Name.Should().Be("Jane Doe");
        user.Age.Should().Be(30);
    }

    [Fact]
    public async Task Create_NameTooShort_Returns400()
    {
        var request = new CreateUserRequest("A", 30, "Sydney", "NSW", "2000");
        var result = await _sut.Create(request);
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Create_AgeOutOfRange_Returns400()
    {
        var request = new CreateUserRequest("Valid Name", 150, "Sydney", "NSW", "2000");
        var result = await _sut.Create(request);
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Create_PincodeTooShort_Returns400()
    {
        var request = new CreateUserRequest("Valid Name", 30, "Sydney", "NSW", "12");
        var result = await _sut.Create(request);
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    // ── PUT ──────────────────────────────────────────────────────────────────

    [Fact]
    public async Task Update_ExistingUser_UpdatesAndReturns200()
    {
        var created = await CreateUserViaController("Alice");
        var request = new UpdateUserRequest("Alice Updated", 35, "Melbourne", "VIC", "3000");

        var result = await _sut.Update(created.Id, request);
        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var user = ok.Value.Should().BeOfType<UserResponse>().Subject;
        user.Name.Should().Be("Alice Updated");
        user.City.Should().Be("Melbourne");
    }

    [Fact]
    public async Task Update_NonExistingUser_Returns404()
    {
        var request = new UpdateUserRequest("Name", 30, "City", "State", "12345");
        var result = await _sut.Update(999, request);
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    // ── DELETE ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task Delete_ExistingUser_Returns204()
    {
        var created = await CreateUserViaController("ToDelete");
        var result = await _sut.Delete(created.Id);
        result.Should().BeOfType<NoContentResult>();

        var check = await _sut.GetById(created.Id);
        check.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task Delete_NonExistingUser_Returns404()
    {
        var result = await _sut.Delete(999);
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private async Task CreateUser(string name)
    {
        _db.Users.Add(new Api.Models.User
        {
            Name = name, Age = 25, City = "Sydney", State = "NSW", Pincode = "2000"
        });
        await _db.SaveChangesAsync();
    }

    private async Task<UserResponse> CreateUserViaController(string name)
    {
        var request = new CreateUserRequest(name, 25, "Sydney", "NSW", "2000");
        var result = await _sut.Create(request);
        var created = (CreatedAtActionResult)result.Result!;
        return (UserResponse)created.Value!;
    }

    public void Dispose() => _db.Dispose();
}
