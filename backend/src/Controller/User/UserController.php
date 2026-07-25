<?php

namespace App\Controller\User;

use App\Dto\User\CreateUserDto;
use App\Dto\User\UpdateUserDto;
use App\Entity\User;
use App\Service\User\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

final class UserController extends AbstractController
{
    /**
     * Inscription (Publique)
     */
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

    /**
     * Récupérer le profil de l'utilisateur actuellement connecté (Securisé)
     */
    #[Route('/user/me', name: 'app_user_me', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function me(#[CurrentUser] User $user, UserService $userService): JsonResponse
    {
        return $this->json($userService->showUser($user), 200);
    }

    /**
     * Modifier son propre profil (Securisé)
     */
    #[Route('/user/me', name: 'app_user_update_me', methods: ['PUT'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function updateMe(
        #[CurrentUser] User $user,
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

    /**
     * Liste tous les utilisateurs (Réservé aux ADMINs)
     */
    #[Route('/users', name: 'app_user_index', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function index(UserService $userService): JsonResponse
    {
        return $this->json($userService->listUsers(), 200);
    }

    /**
     * Voir un utilisateur spécifique par ID (Réservé aux ADMINs)
     */
    #[Route('/user/{id}', name: 'app_user_show', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function show(User $user, UserService $userService): JsonResponse
    {
        return $this->json($userService->showUser($user), 200);
    }

    /**
     * Supprimer un utilisateur (Réservé aux ADMINs)
     */
    #[Route('/user/{id}', name: 'app_user_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(User $user, UserService $userService): JsonResponse
    {
        $userService->deleteUser($user);
        return $this->json(null, 204);
    }
}