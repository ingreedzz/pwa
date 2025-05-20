import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/story/add-story-page';
import StoryDetailPage from '../pages/story-detail/story-detail-pages';
import RegisterPage from '../pages/register/register-page';
import LoginPage from '../pages/login/login-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/add-story': new AddStoryPage(),
  '/register': new RegisterPage(),
  '/login': new LoginPage(),
  '/story/:id': new StoryDetailPage(), // Ensure this route is registered
};

export default routes;
