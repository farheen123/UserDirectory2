using FluentValidation;
using UserDirectory.Api.DTOs;

namespace UserDirectory.Api.Validators;

public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .Length(2, 100).WithMessage("Name must be between 2 and 100 characters.");

        RuleFor(x => x.Age)
            .InclusiveBetween(0, 120).WithMessage("Age must be between 0 and 120.");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required.")
            .MaximumLength(100).WithMessage("City must not exceed 100 characters.");

        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State is required.")
            .MaximumLength(100).WithMessage("State must not exceed 100 characters.");

        RuleFor(x => x.Pincode)
            .NotEmpty().WithMessage("Pincode is required.")
            .Length(4, 10).WithMessage("Pincode must be between 4 and 10 characters.")
            .Matches(@"^[A-Za-z0-9\s\-]+$").WithMessage("Pincode contains invalid characters.");
    }
}

public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .Length(2, 100).WithMessage("Name must be between 2 and 100 characters.");

        RuleFor(x => x.Age)
            .InclusiveBetween(0, 120).WithMessage("Age must be between 0 and 120.");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required.")
            .MaximumLength(100).WithMessage("City must not exceed 100 characters.");

        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State is required.")
            .MaximumLength(100).WithMessage("State must not exceed 100 characters.");

        RuleFor(x => x.Pincode)
            .NotEmpty().WithMessage("Pincode is required.")
            .Length(4, 10).WithMessage("Pincode must be between 4 and 10 characters.")
            .Matches(@"^[A-Za-z0-9\s\-]+$").WithMessage("Pincode contains invalid characters.");
    }
}
