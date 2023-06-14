import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

@Controller('health')
export class HealthCheckController {
    constructor(
        private healthCheckService: HealthCheckService,
    ){}

    @Get()
    @HealthCheck()
    checkHealth() {
        return this.healthCheckService.check([]);
    }
}