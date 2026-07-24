<?php

namespace App\Service\User;

use App\Repository\UserRepository;
use App\Dto\User\CreateUserDto;
use App\Dto\User\UpdateUserDto;
use App\Dto\User\UserResponseDto;
use App\Entity\User;
use App\Exception\ValidationException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private ValidatorInterface $validator,
        private UserPasswordHasherInterface $passwordHasher
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
        return UserResponseDto::fromEntity($user);
    }

    public function createUser(CreateUserDto $createUserDto): UserResponseDto
    {
        $this->validateOrThrow($createUserDto);

        if ($createUserDto->email !== null) {
            $existingUser = $this->userRepository->findOneBy(['email' => $createUserDto->email]);
            if ($existingUser) {
                throw new \App\Exception\ValidationException([
                    'email' => ['Cet email est déjà utilisé.']
                ], 422);
            }
        }

        $user = new User();
        $user->setEmail($createUserDto->email);
        $user->setFirstName($createUserDto->firstName ?: null);
        $user->setLastName($createUserDto->lastName ?: null);

        // roles
        if(!empty($createUserDto->roles)){
            $user->setRoles($createUserDto->roles);
        }
        $hashedPassword = $this->passwordHasher->hashPassword($user, $createUserDto->password);
        $user->setPassword($hashedPassword);
        $this->userRepository->save($user, true);

        return UserResponseDto::fromEntity($user);
    }

    public function updateUser(User $user, UpdateUserDto $updateUserDto): UserResponseDto
    {
        $this->validateOrThrow($updateUserDto);

        if ($updateUserDto->email !== $user->getEmail()) {
            $existingUser = $this->userRepository->findOneBy(['email' => $updateUserDto->email]);
            if ($existingUser) {
                throw new ValidationException([
                    'email' => ['Cet email est déjà utilisé.']
                ], 422);
            }
        }

        $user->setEmail($updateUserDto->email);
        $user->setFirstName($updateUserDto->firstName);
        $user->setLastName($updateUserDto->lastName);

        $this->userRepository->save($user, true);

        return UserResponseDto::fromEntity($user);
    }

    public function deleteUser(User $user): void
    {
        $this->userRepository->remove($user, true);
    }

    private function validateOrThrow(object $dto): void
    {
        $violations = $this->validator->validate($dto);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[$violation->getPropertyPath()][] = $violation->getMessage();
            }

            throw new ValidationException($errors, 422);
        }
    }
}