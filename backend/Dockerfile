# ── Build stage ──────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY UserDirectory.sln ./
COPY UserDirectory.Api/UserDirectory.Api.csproj ./UserDirectory.Api/
COPY UserDirectory.Tests/UserDirectory.Tests.csproj ./UserDirectory.Tests/

RUN dotnet restore

COPY . .

RUN dotnet publish UserDirectory.Api/UserDirectory.Api.csproj -c Release -o /app/publish

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

RUN mkdir -p /data && chmod 777 /data

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production
ENV Database__Path=/data/app.db

EXPOSE 5000

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

ENTRYPOINT ["dotnet", "UserDirectory.Api.dll"]
