import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  useTheme,
  useMediaQuery,
  Zoom,
  styled
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Styled components
const BackgroundWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(18px) saturate(180%)',
    WebkitBackdropFilter: 'blur(18px) saturate(180%)',
    zIndex: 1,
  },
}));

const BackgroundSlider = styled(Slider)({
  '& .slick-list, & .slick-track': {
    height: '100vh',
  },
  '& .slick-slide': {
    height: '100vh',
  },
  '& .slick-slide img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(3px)',
  },
});

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  background: 'rgba(255, 255, 255, 0.45)',
  backdropFilter: 'blur(18px) saturate(180%)',
  WebkitBackdropFilter: 'blur(18px) saturate(180%)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  border: '1.5px solid rgba(255, 255, 255, 0.35)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
  color: '#222',
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 'bold',
  color: '#FFD700',
  textAlign: 'center',
  textShadow: '2px 2px 8px rgba(0,0,0,0.15)',
  fontFamily: 'Montserrat, "Playfair Display", serif',
  letterSpacing: '0.04em',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  cursor: 'pointer',
  borderRadius: '24px',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(.4,2,.3,1)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
  '&:hover': {
    transform: 'scale(1.04) translateY(-6px)',
    boxShadow: '0 16px 32px 0 rgba(31, 38, 135, 0.22)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.08)',
      filter: 'brightness(1.08)',
    },
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 300,
  transition: 'transform 0.5s cubic-bezier(.4,2,.3,1), filter 0.5s',
  opacity: 0,
  animation: 'fadeInImg 1.2s forwards',
  '@keyframes fadeInImg': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  [theme.breakpoints.down('sm')]: {
    height: 250,
  },
}));

const FeaturedSlider = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  '& .slick-slide': {
    padding: theme.spacing(1),
  },
  '& .slick-dots': {
    bottom: '-40px',
  },
  '& .slick-dots li button:before': {
    color: '#ffffff',
    fontSize: '12px',
  },
  '& .slick-dots li.slick-active button:before': {
    color: '#ffffff',
  },
}));

const FeaturedImage = styled(Box)(({ theme }) => ({
  height: '60vh',
  position: 'relative',
  borderRadius: '20px',
  overflow: 'hidden',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    height: '40vh',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const FeaturedContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(4),
  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
  color: 'white',
}));

const MotionGrid = motion(Grid);

const FullScreenModal = styled(motion.div)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(255, 255, 255, 0.45)',
  backdropFilter: 'blur(18px) saturate(180%)',
  WebkitBackdropFilter: 'blur(18px) saturate(180%)',
  zIndex: 9999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  cursor: 'pointer',
});

const FullScreenImage = styled(motion.img)({
  maxWidth: '95%',
  maxHeight: '95vh',
  objectFit: 'contain',
  borderRadius: '8px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
});

const ContactSection = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.45)',
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  border: '1.5px solid rgba(255, 255, 255, 0.35)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
  color: '#222',
}));

const ContactTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  color: '#ffffff',
  fontFamily: '"Playfair Display", serif',
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  alignItems: 'center',
  color: '#111',
  '& p': {
    margin: 0,
    fontSize: '1.1rem',
    color: '#111',
  },
}));

const BottomImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '400px',
  position: 'relative',
  borderRadius: '20px',
  overflow: 'hidden',
  marginTop: theme.spacing(4),
  cursor: 'pointer',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

// Enhanced Loading Animation
const LoadingWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(45deg, #1a1a1a 30%, #2d2d2d 90%)',
  zIndex: 10000,
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  color: '#fff',
  marginTop: theme.spacing(3),
  fontSize: '1.5rem',
  fontWeight: 'bold',
  letterSpacing: '0.05em',
  textShadow: '1px 1px 8px #000',
  animation: 'fadeIn 1.2s',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}));

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: -2,
  background: 'linear-gradient(270deg, #f5e8c5, #e0c3fc, #8ec5fc, #e0c3fc, #f5e8c5)',
  backgroundSize: '400% 400%',
  animation: 'gradientBG 18s ease infinite',
  '@keyframes gradientBG': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

// Modal close button
const ModalCloseButton = styled('button')(({ theme }) => ({
  position: 'absolute',
  top: 24,
  right: 32,
  background: 'rgba(0,0,0,0.5)',
  color: '#FFD700',
  border: 'none',
  borderRadius: '50%',
  width: 40,
  height: 40,
  fontSize: 28,
  cursor: 'pointer',
  zIndex: 10001,
  transition: 'background 0.2s',
  '&:hover': {
    background: 'rgba(0,0,0,0.7)',
  },
}));

// Add styled component for the bottom image
const BottomCardImage = styled('img')(({ theme }) => ({
  display: 'block',
  margin: '40px auto 24px auto',
  maxWidth: '400px',
  width: '90%',
  borderRadius: '18px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
  background: 'rgba(255,255,255,0.7)',
  padding: theme.spacing(1),
}));

const TempleGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    const imagesRef = ref(database, 'temple_web');
    const unsubscribe = onValue(imagesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          // Convert the object to an array of images
          const imagesArray = Object.values(data);
          setImages(imagesArray);
        } else {
          setImages([]);
        }
      } catch (error) {
        console.error('Error processing images:', error);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching images:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const backgroundSliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
  };

  const featuredSliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: true,
    adaptiveHeight: true,
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <CircularProgress size={70} thickness={5} sx={{ color: '#fff' }} />
        </motion.div>
        <LoadingText>
          Loading Gallery…
        </LoadingText>
      </LoadingWrapper>
    );
  }

  return (
    <>
      {/* Animated Gradient Background */}
      <AnimatedBackground />
      <BackgroundWrapper>
        <BackgroundSlider {...backgroundSliderSettings}>
          {images.slice(0, 5).map((image) => (
            <Box key={`bg-${image.id}`}>
              <img src={image.url} alt="Background" />
            </Box>
          ))}
        </BackgroundSlider>
      </BackgroundWrapper>

      <Box className="min-h-screen py-8">
        <Container maxWidth="lg">
          {/* Top Contact Section - Minimal Info */}
          <ContactSection sx={{ marginTop: '32px' }}>
            <ContactInfo>
              <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                सर्वज्ञ शिल्पकार कला संच
              </Typography>
              <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                शिंदे बंधु
              </Typography>
              <Typography>📞 9764208020, 8806207996</Typography>
            </ContactInfo>
          </ContactSection>

          <ContentWrapper>
            <TitleWrapper>
              <Title variant="h1">
                Gallery
              </Title>
            </TitleWrapper>

            {/* Featured Slider */}
            <FeaturedSlider>
              <Slider {...featuredSliderSettings}>
                {images.slice(0, 5).map((image) => (
                  <FeaturedImage 
                    key={image.id}
                    onClick={() => handleImageClick(image)}
                  >
                    <img src={image.url} alt="Temple" />
                  </FeaturedImage>
                ))}
              </Slider>
            </FeaturedSlider>

            {/* Grid View */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Grid container spacing={3}>
                <AnimatePresence>
                  {images.map((image) => (
                    <MotionGrid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={image.id}
                      variants={itemVariants}
                      layout
                    >
                      <Zoom in timeout={500}>
                        <StyledCard onClick={() => handleImageClick(image)}>
                          <StyledCardMedia
                            component="img"
                            image={image.url}
                            alt="Temple"
                          />
                        </StyledCard>
                      </Zoom>
                    </MotionGrid>
                  ))}
                </AnimatePresence>
              </Grid>
            </motion.div>

            <Box className="flex justify-center mt-8">
              <Typography
                variant="h5"
                className="bg-gradient-to-r from-gray-700 to-gray-900 shadow-lg rounded-full px-6 py-3 text-white font-bold"
                sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
              >
                Total Images: {images.length}
              </Typography>
            </Box>

            {/* Bottom Image */}
            {images.length > 0 && (
              <BottomImage onClick={() => handleImageClick(images[0])}>
                <img src={images[0].url} alt="Featured Temple" />
              </BottomImage>
            )}
          </ContentWrapper>

            {/* Bottom Contact Section - Full Info */}
            <ContactSection>
              <ContactTitle>संपर्क जानकारी / Contact Information</ContactTitle>
              <ContactInfo>
                {/* Hindi */}
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>शिल्पकार शिंदे बंधु</Typography>
                <Typography>शिल्पकार: विलास रावसाहेब शिंदे</Typography>
                <Typography>मो.: 9764208020, 8806207996</Typography>
                <Typography sx={{ mt: 2 }}>
                  हमारे यहाँ मंदिर (मंदिर शिखर, कलश, गुम्बज के और सम्पूर्ण मंदिर निर्माण कार्य) कॉन्ट्रैक्ट के अनुसार बनाए जाते हैं..!
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  मंदिर बनवाने हेतु संपर्क करें:<br/>
                  शिल्पकार विलास रावसाहेब शिंदे<br/>
                  मो.: 9764208020
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  पता: तहसील लोहा, जिला नांदेड (महाराष्ट्र)
                </Typography>
                {/* English */}
                <Box sx={{ mt: 4, borderTop: '1px solid #fff', pt: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Shilpkar Shinde Bandhu</Typography>
                  <Typography>Sculptor: Vilas Raosaheb Shinde</Typography>
                  <Typography>Mob.: 9764208020, 8806207996</Typography>
                  <Typography sx={{ mt: 2 }}>
                    We undertake temple (temple spire, kalash, dome, and complete temple construction) contracts as per requirements..!
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    For temple construction, contact:<br/>
                    Sculptor Vilas Raosaheb Shinde<br/>
                    Mob.: 9764208020
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    Address: Tehsil Loha, District Nanded (Maharashtra)
                  </Typography>
                </Box>
              </ContactInfo>
            </ContactSection>
        </Container>
      </Box>

      {/* Business Card Image at the very bottom */}
      <BottomCardImage src="/shilpkar.jpg" alt="Shilpkar Shinde Business Card" />

      <AnimatePresence>
        {selectedImage && (
          <FullScreenModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <ModalCloseButton onClick={handleCloseModal} aria-label="Close">×</ModalCloseButton>
            <FullScreenImage
              src={selectedImage.url}
              alt="Full size"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
          </FullScreenModal>
        )}
      </AnimatePresence>
    </>
  );
};

export default TempleGallery;