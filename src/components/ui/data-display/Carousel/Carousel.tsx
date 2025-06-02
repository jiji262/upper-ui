// src/components/ui/data-display/Carousel/Carousel.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../../general/Button/Button'; // Assuming Button is available
import Icon from '../../general/Icon/Icon';   // Assuming Icon is available
import './Carousel.css';

interface CarouselProps {
  children: React.ReactNode[]; // Array of slides
  autoplay?: boolean;
  autoplaySpeed?: number; // Default 3000ms
  dots?: boolean | { className?: string; }; // Show dots, optionally with class
  arrows?: boolean; // Show next/prev arrows
  prevArrow?: React.ReactNode; // Custom prev arrow
  nextArrow?: React.ReactNode; // Custom next arrow
  dotPosition?: 'top' | 'bottom' | 'left' | 'right'; // Default 'bottom'
  effect?: 'scrollx' | 'fade'; // Default 'scrollx'
  easing?: string; // CSS easing function, default 'ease'
  speed?: number; // Transition speed in ms, default 500
  
  initialSlide?: number; // Default 0
  // Infinite looping is complex, not implemented in this simplified version
  // adaptiveHeight?: boolean; // Adjust height to current slide, not implemented

  beforeChange?: (current: number, next: number) => void;
  afterChange?: (current: number) => void;
  
  className?: string;
  style?: React.CSSProperties;
  // slickGoTo?: (slideNumber: number, dontAnimate?: boolean) => void; // Method to jump to slide (via ref)
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  autoplay = false,
  autoplaySpeed = 3000,
  dots = true,
  arrows = false,
  prevArrow,
  nextArrow,
  dotPosition = 'bottom',
  effect = 'scrollx',
  easing = 'ease', // Not directly used in this simplified CSS transition
  speed = 500,
  initialSlide = 0,
  beforeChange,
  afterChange,
  className,
  style,
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isTransitioning, setIsTransitioning] = useState(false); // Prevent rapid changes
  const slideCount = React.Children.count(children);
  const slideTrackRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((slideIndex: number, fromAutoplay: boolean = false) => {
    if (isTransitioning && !fromAutoplay) return; // Prevent manual change during transition
    
    beforeChange?.(currentSlide, slideIndex);
    setIsTransitioning(true);
    setCurrentSlide(slideIndex);

    setTimeout(() => {
      setIsTransitioning(false);
      afterChange?.(slideIndex);
    }, speed); // Match transition duration
  }, [currentSlide, beforeChange, afterChange, speed, isTransitioning]);


  useEffect(() => {
    if (autoplay) {
      autoplayTimerRef.current = setInterval(() => {
        goToSlide((currentSlide + 1) % slideCount, true);
      }, autoplaySpeed);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, autoplaySpeed, currentSlide, slideCount, goToSlide]);

  const handlePrev = () => {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  };

  const handleNext = () => {
    goToSlide((currentSlide + 1) % slideCount);
  };
  
  const handleDotClick = (index: number) => {
    goToSlide(index);
  };


  const trackStyle: React.CSSProperties = {
    transition: effect === 'fade' ? `opacity ${speed}ms ${easing}` : `transform ${speed}ms ${easing}`,
    // display: 'flex', // Already in CSS
  };

  if (effect === 'scrollx') {
    trackStyle.transform = `translateX(-${currentSlide * 100}%)`;
  }
  // For fade effect, opacity is handled by individual slide items based on currentSlide

  const containerClasses = [
    'ant-carousel',
    `ant-carousel-dots-${dotPosition}`,
    arrows ? 'ant-carousel-arrows' : '',
    className,
  ].filter(Boolean).join(' ');
  
  const defaultPrevArrow = <Button type="text" shape="circle" icon={<Icon name="LeftOutlined" />} />;
  const defaultNextArrow = <Button type="text" shape="circle" icon={<Icon name="RightOutlined" />} />;


  return (
    <div className={containerClasses} style={style}>
      <div className="slick-slider"> {/* Mimic slick structure for styling */}
        {arrows && (
          <button
            type="button"
            className="slick-arrow slick-prev"
            onClick={handlePrev}
            disabled={isTransitioning}
          >
            {prevArrow || defaultPrevArrow}
          </button>
        )}
        <div className="slick-list" style={{ overflow: 'hidden' }}>
          <div className={`slick-track ${effect === 'fade' ? 'slick-track-fade' : ''}`} ref={slideTrackRef} style={trackStyle}>
            {React.Children.map(children, (child, index) => (
              <div
                className={`slick-slide ${index === currentSlide ? 'slick-active' : ''}`}
                style={{ 
                    opacity: effect === 'fade' ? (index === currentSlide ? 1 : 0) : 1,
                    transition: effect === 'fade' ? `opacity ${speed}ms ${easing}` : undefined,
                    // For fade, ensure only active is visible to prevent overlap issues
                    position: effect === 'fade' && index !== currentSlide ? 'absolute' : 'relative',
                    width: effect === 'fade' ? '100%' : undefined, // Ensure fade slides take full width
                 }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
        {arrows && (
          <button
            type="button"
            className="slick-arrow slick-next"
            onClick={handleNext}
            disabled={isTransitioning}
          >
            {nextArrow || defaultNextArrow}
          </button>
        )}
        {dots && (
          <ul className={`slick-dots slick-dots-${dotPosition} ${typeof dots === 'object' ? dots.className : ''}`}>
            {React.Children.map(children, (_, index) => (
              <li
                key={index}
                className={index === currentSlide ? 'slick-active' : ''}
                onClick={() => handleDotClick(index)}
              >
                <button type="button" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Carousel;
