namespace UserDirectory.Api.DTOs;

public record CreateUserRequest(
    string Name,
    int Age,
    string City,
    string State,
    string Pincode
);

public record UpdateUserRequest(
    string Name,
    int Age,
    string City,
    string State,
    string Pincode
);

public record UserResponse(
    int Id,
    string Name,
    int Age,
    string City,
    string State,
    string Pincode,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
