import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      userId,
    });

    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user'],
      select: {
        user: {
          id: true,
          login: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
          login: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`post ${id} not found`);
    }

    return post;
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`post ${id} not found`);
    }

    if (post.userId !== userId) {
      throw new NotFoundException(`post ${id} not found`);
    }

    await this.postRepository.delete(id);
  }
}
