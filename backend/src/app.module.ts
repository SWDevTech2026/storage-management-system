import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ItemsModule } from './items/items.module';

/**
 * @class AppModule
 * @description The root module of the application responsible for initializing the database connection and gathering sub-modules.
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'storage_management',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Always false when using an explicit ddl.sql file
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ItemsModule,
  ],
})
export class AppModule {}
