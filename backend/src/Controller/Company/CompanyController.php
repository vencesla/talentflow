<?php

namespace App\Controller\Company;

use App\Dto\Company\CompanyInputDto;
use App\Dto\Company\CompanyResponseDto;
use App\Dto\Company\CompanyUpdateDto;
use App\Entity\User;
use App\Repository\CompanyRepository;
use App\Service\Company\CompanyService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/companies', name: 'api_company_')]
#[IsGranted('ROLE_RECRUITER')]
final class CompanyController extends AbstractController
{
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        SerializerInterface $serializer,
        CompanyService $companyService
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        /** @var CompanyInputDTO $dto */
        $dto = $serializer->deserialize($request->getContent(), CompanyInputDTO::class, 'json');

        $companyResponse = $companyService->createCompany($dto, $user);

        return $this->json($companyResponse, 201);
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    #[IsGranted('ROLE_RECRUITER')]
    public function getMyCompany(
        #[CurrentUser] User $user,
    ): JsonResponse {
        $company = $user->getCompany();

        if (!$company) {
            return $this->json(['message' => 'Aucune entreprise rattachée'], 404);
        }

        return $this->json(CompanyResponseDto::fromEntity($company), 200);
    }

    #[Route('/me', name: 'update_me', methods: ['PUT'])]
    #[IsGranted('ROLE_RECRUITER')]
    public function updateMyCompany(
        #[CurrentUser] User $user,
        Request $request,
        SerializerInterface $serializer,
        CompanyService $companyService
    ): JsonResponse {
        $company = $user->getCompany();

        if (!$company) {
            return $this->json(['message' => 'Aucune entreprise rattachée'], 404);
        }

        /** @var CompanyUpdateDto $dto */
        $dto = $serializer->deserialize($request->getContent(), CompanyUpdateDto::class, 'json');

        return $this->json($companyService->updateCompany($company, $dto), 200);
    }
}