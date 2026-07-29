<?php

namespace App\Service\User;

use App\Repository\UserRepository;
use App\Dto\User\CreateUserDto;
use App\Dto\User\UpdateUserDto;
use App\Dto\User\UserResponseDto;
use App\Entity\User;
use App\Exception\ValidationException;
use App\Service\Validation\DTOValidator;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly DTOValidator $dtoValidator,
        private readonly UserPasswordHasherInterface $passwordHasher
    )
    {}

    public function listUsers(): array
    {
        $users = $this->userRepository->findAll();

        return array_map(
            fn(User $user) => UserResponseDto::fromEntity($user),
            $users
        );
    }

    public function showUser(User $user): UserResponseDto
    {
        $fullUser = $this->userRepository->findOneWithCompany($user->getId()) ?? $user;

        return UserResponseDto::fromEntity($fullUser);
    }

    public function createUser(CreateUserDto $createUserDto): UserResponseDto
    {
        $this->dtoValidator->validate($createUserDto);

        if ($createUserDto->email !== null) {
            $existingUser = $this->userRepository->findOneBy(['email' => $createUserDto->email]);
            if ($existingUser) {
                throw new ValidationException([
                    'email' => ['Cet email est déjà utilisé.']
                ], 422);
            }
        }

        $user = new User();
        $user->setEmail($createUserDto->email);
        $user->setFirstName($createUserDto->firstName ?: null);
        $user->setLastName($createUserDto->lastName ?: null);
        $user->setRoles($createUserDto->roles);

        // Champs spécifiques selon le rôle
        if (in_array('ROLE_CANDIDATE', $createUserDto->roles, true)) {
            $user->setLocations($createUserDto->locations);
            $user->setJobTitles($createUserDto->jobTitles);
            $user->setContractTypes($createUserDto->contractTypes);   
        } 

        $hashedPassword = $this->passwordHasher->hashPassword($user, $createUserDto->password);
        $user->setPassword($hashedPassword);

        $this->userRepository->save($user, true);

        return UserResponseDto::fromEntity($user);
    }

    public function updateUser(User $user, UpdateUserDto $updateUserDto): UserResponseDto
    {
        $this->dtoValidator->validate($updateUserDto);

        // Verification de l'email uniquement s'il est fourni et différent
        if ($updateUserDto->email !== null && $updateUserDto->email !== $user->getEmail()) {
            $existingUser = $this->userRepository->findOneBy(['email' => $updateUserDto->email]);
            if ($existingUser) {
                throw new ValidationException([
                    'email' => ['Cet email est déjà utilisé.']
                ], 422);
            }
            $user->setEmail($updateUserDto->email);
        }

        // Mise à jour sélective des champs
        if ($updateUserDto->firstName !== null) {
            $user->setFirstName($updateUserDto->firstName);
        }

        if ($updateUserDto->lastName !== null) {
            $user->setLastName($updateUserDto->lastName);
        }

        $this->userRepository->save($user, true);

        return UserResponseDto::fromEntity($user);
    }

    public function deleteUser(User $user): void
    {
        $this->userRepository->remove($user, true);
    }
}