// Tests that the findUserByEmail method returns a User object.
import {UsersService} from "../../src/small-square/app/users.service";
import {NotFoundException} from "@nestjs/common";
import {UserRepository} from "../../src/small-square/infra/repositories/user.repository";
import {UsuariosEntity} from "../../src/small-square/domain/entities";

it("Test para retornar una instancia de usuario", async () => {
    const userRepositoryMock = {
        findUserByEmail: jest.fn().mockResolvedValue(new UsuariosEntity())
    }
    const usersService = new UsersService(userRepositoryMock as any)

    const email = "test@test.com"
    const result = await usersService.findUserByEmail(email)

    expect(result).toBeInstanceOf(UsuariosEntity)
})

// Tests that the findUserByEmail method returns the correct User object based on the email parameter.
it("test_find_user_by_email_returns_correct_user_object", async () => {
    const userRepositoryMock = {
        findUserByEmail: jest.fn().mockResolvedValue(new UsuariosEntity())
    }
    const usersService = new UsersService(userRepositoryMock as any)

    const result = await usersService.findUserByEmail("test@test.com")

    expect(result.correo).toBe("test@test.com")
})

// Tests that the findUserByEmail method throws an error when the email parameter is null.
it("test_find_user_with_null_email_throws_error", async () => {
    const userRepositoryMock = {
        findUserByEmail: jest.fn().mockResolvedValue(null)
    }
    const usersService = new UsersService(userRepositoryMock as any)

    await expect(usersService.findUserByEmail(null)).rejects.toThrow()
})

// Tests that the findUserByEmail method throws a NotFoundException if the user is not found.
it("test_find_user_throws_not_found_exception_if_user_not_found", async () => {
    const userRepositoryMock = {
        findUserByEmail: jest.fn().mockResolvedValue(null)
    }
    const usersService = new UsersService(userRepositoryMock as any)

    await expect(usersService.findUserByEmail("nonexistent@test.com")).rejects.toThrow(NotFoundException)
})

// Tests that the UserRepository class uses test doubles for its DataSource dependency.
it("test_user_repository_dependency_uses_test_doubles", async () => {
    const dataSourceMock = {
        createEntityManager: jest.fn()
    }
    const userRepository = new UserRepository(dataSourceMock as any)

    expect(userRepository.dataSource).toBe(dataSourceMock)
})