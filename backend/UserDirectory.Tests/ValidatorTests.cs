using FluentAssertions;
using UserDirectory.Api.DTOs;
using UserDirectory.Api.Validators;
using Xunit;

namespace UserDirectory.Tests;

public class ValidatorTests
{
    private readonly CreateUserRequestValidator _validator = new();

    [Theory]
    [InlineData("A")]           // Too short
    [InlineData("")]            // Empty
    public async Task Name_Invalid_FailsValidation(string name)
    {
        var request = new CreateUserRequest(name, 25, "Sydney", "NSW", "2000");
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(121)]
    public async Task Age_OutOfRange_FailsValidation(int age)
    {
        var request = new CreateUserRequest("Valid Name", age, "Sydney", "NSW", "2000");
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Age");
    }

    [Theory]
    [InlineData(0)]
    [InlineData(120)]
    [InlineData(30)]
    public async Task Age_InRange_PassesValidation(int age)
    {
        var request = new CreateUserRequest("Valid Name", age, "Sydney", "NSW", "2000");
        var result = await _validator.ValidateAsync(request);
        result.Errors.Should().NotContain(e => e.PropertyName == "Age");
    }

    [Theory]
    [InlineData("12")]          // Too short (< 4)
    [InlineData("12345678901")] // Too long (> 10)
    public async Task Pincode_Invalid_FailsValidation(string pincode)
    {
        var request = new CreateUserRequest("Valid Name", 25, "Sydney", "NSW", pincode);
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Pincode");
    }

    [Fact]
    public async Task ValidRequest_PassesAllValidation()
    {
        var request = new CreateUserRequest("Jane Doe", 28, "Melbourne", "VIC", "3001");
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }
}
