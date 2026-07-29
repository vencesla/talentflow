<?php

namespace App\Service\Company;

use App\Dto\Company\CompanyInputDTO;
use App\Dto\Company\CompanyResponseDto;
use App\Dto\Company\CompanyUpdateDto;
use App\Entity\Company;
use App\Entity\User;
use App\Exception\ValidationException;
use App\Repository\CompanyRepository;
use App\Service\Validation\DTOValidator;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class CompanyService
{

    public function __construct(
        private readonly CompanyRepository $companyRepository,
        private readonly DTOValidator $dtoValidator,
    ) {}

    public function createCompany(CompanyInputDTO $dto, User $user): CompanyResponseDto
    {
        $this->dtoValidator->validate($dto);

        // Si le recruteur a déjà une entreprise
        if ($user->getCompany() !== null) {
            throw new BadRequestHttpException('Vous êtes déjà rattaché à une entreprise.');
        }

        $company = new Company();
        $company->setName($dto->name);
        $company->setSiret($dto->siret);
        $company->setDescription($dto->description);
        $company->setWebsite($dto->website);
        $company->setLogo($dto->logo);
        $company->setZipCode($dto->zipCode);
        $company->setCity($dto->city);

        $user->setCompany($company);

        $this->companyRepository->save($company, true);

        return CompanyResponseDto::fromEntity($company);
    }

    public function updateCompany(Company $company, CompanyUpdateDto $dto): CompanyResponseDto
    {
        $company->setName($dto->name ?? $company->getName());
        $company->setSiret($dto->siret);
        $company->setIndustry($dto->industry);
        $company->setWebsite($dto->website);
        $company->setDescription($dto->description);
        $company->setAddress($dto->address);
        $company->setCity($dto->city);
        $company->setZipCode($dto->zipCode);
        $company->setCountry($dto->country);
        $company->setLogo($dto->logo);

        $this->companyRepository->save($company, true);

        return CompanyResponseDto::fromEntity($company);
    }
}