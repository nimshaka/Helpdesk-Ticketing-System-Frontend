'use client';

import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
export default function AuthCarousel() {
  const carouselSlides = [
{
  id: 1,
  title: 'User Request',
  description: 'Report issues via portal, email, or direct contact.',
  image: '/auth/auth1.webp',
},
{
  id: 2,
  title: 'Ticket Creation & Routing',
  description: 'Tickets are auto-generated and sent to the right team.',
  image: '/auth/auth2.webp',
},
{
  id: 3,
  title: 'Triage & Assignment',
  description: 'Urgency is assessed and a specialist is assigned.',
  image: '/auth/auth3.webp',
},
{
  id: 4,
  title: 'Investigation & Resolution',
  description: 'Troubleshooting and technical support to solve the problem.',
  image: '/auth/auth4.webp',
},
{
  id: 5,
  title: 'Closure & Confirmation',
  description: 'Solution logged in KB and user confirms satisfaction.',
  image: '/auth/auth5.webp',
},
  ];

  return (
    <div className="fixed top-0 left-0 hidden h-screen w-1/2 overflow-hidden lg:block">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        speed={800}
        className="h-full w-full"
      >
        {carouselSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <div className="absolute inset-0">
                <Image
                  alt=""
                  fill
                  sizes="50vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  src={slide.image}
                  priority={slide.id === 1}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
              </div>

              <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24 text-center">
                <h2 className="mb-4 px-8 text-[32px] font-extrabold text-foreground drop-shadow-sm">{slide.title}</h2>
                <p className="max-w-md px-8 text-lg font-medium leading-relaxed text-foreground-secondary">
                  {slide.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>
        {`
          .swiper-pagination {
            bottom: 60px !important;
          }
          .swiper-pagination-bullet {
            background: var(--foreground-muted);
            opacity: 1;
            width: 10px;
            height: 10px;
            margin: 0 6px !important;
            transition: all 0.3s ease;
            border-radius: 50%;
          }
          .swiper-pagination-bullet-active {
            background: var(--primary);
          }
        `}
      </style>
    </div>
  );
}
