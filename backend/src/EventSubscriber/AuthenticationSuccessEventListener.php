<?php
namespace App\EventListener;

use App\Dto\User\UserResponseDto;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

final class AuthenticationSuccessEventListener
{
    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event): void
    {
        $user = $event->getUser();

        if (!$user instanceof User) {
            return;
        }

        $data = $event->getData();
        
        // On injecte directement le profil dans la réponse du login !
        $data['user'] = UserResponseDto::fromEntity($user);

        $event->setData($data);
    }
}