<?php

namespace ShinyDeploy\Domain\Deployment\Tasks;

interface TaskInterface
{
    public function setIdentifier(): void;

    public function getIdentifier(): string;

    public function setName(): void;

    public function getName(): string;
}
