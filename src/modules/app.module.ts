import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import entities from 'src/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import enviroments from 'src/common/enviroments';
import { BullModule } from '@nestjs/bull';
import { ReminderModule } from 'src/jobs/reminder/reminder.module';

@Module({
  imports: [
    AuthModule,
    NoteModule,
    UserModule,
    ReminderModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [enviroments],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities,
        synchronize: true, // shouldn't be used in production - otherwise you can lose production data.
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        <RedisClientOptions>{
          store: redisStore,
          url: configService.get('redis.url'),
        },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
