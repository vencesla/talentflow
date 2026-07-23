<?php

namespace App\Controller\User;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\User\UserService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use App\Dto\User\CreateUserDto;
use App\Dto\User\UpdateUserDto;
use App\Entity\User;

final class UserController extends AbstractController
{
    #[Route('/users', name: 'app_user_index', methods: ['GET'])]
    public function index(UserService $userService): JsonResponse
    {
        return $this->json($userService->listUsers(), 200);
    }

    #[Route('/user', name: 'app_user_create', methods: ['POST'])]
    public function create(
        Request $request,
        SerializerInterface $serializer,
        UserService $userService
    ): JsonResponse {
        /** @var CreateUserDto $createUserDto */
        $createUserDto = $serializer->deserialize($request->getContent(), CreateUserDto::class, 'json');

        $userDto = $userService->createUser($createUserDto);

        return $this->json($userDto, 201);
    }

    #[Route('/user/{id}', name: 'app_user_show', methods: ['GET'])]
    public function show(User $user, UserService $userService): JsonResponse
    {
        return $this->json($userService->showUser($user), 200);
    }

    #[Route('/user/{id}', name: 'app_user_update', methods: ['PUT'])]
    public function update(
        User $user,
        Request $request,
        SerializerInterface $serializer,
        UserService $userService
    ): JsonResponse {
        /** @var UpdateUserDto $dto */
        $dto = $serializer->deserialize(
            $request->getContent(),
            UpdateUserDto::class,
            'json'
        );

        return $this->json($userService->updateUser($user, $dto), 200);
    }

    #[Route('/user/{id}', name: 'app_user_delete', methods: ['DELETE'])]
    public function delete(User $user, UserService $userService): JsonResponse
    {
        $userService->deleteUser($user);
        return $this->json(null, 204);
    }
}
