import React, { useState } from 'react';
import { 
  Book, 
  HandMetal, 
  Share2, 
  Video, 
  Wand2, 
  LayoutDashboard, 
  Users, 
  QrCode, 
  Palette, 
  Cloud, 
  Shield, 
  MessageSquare,
  CheckCircle,
  Zap,
  Clock,
  Trophy,
  Menu,
  X,
  Plus
} from 'lucide-react';

// Types
interface Book {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  pages: BookPage[];
  createdAt: Date;
  updatedAt: Date;
}

interface BookPage {
  id: string;
  content: string;
  signLanguageVideo?: string;
  imageUrl?: string;
  pageNumber: number;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCreatingBook, setIsCreatingBook] = useState(false);

  // Gestionnaire de création de livre
  const handleCreateBook = (newBook: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    const book: Book = {
      ...newBook,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBooks([...books, book]);
    setIsCreatingBook(false);
  };

  // Gestionnaire de mise à jour de livre
  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(books.map(book => 
      book.id === updatedBook.id 
        ? { ...updatedBook, updatedAt: new Date() }
        : book
    ));
  };

  // Gestionnaire de suppression de livre
  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(book => book.id !== bookId));
    if (selectedBook?.id === bookId) {
      setSelectedBook(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-blue-600 text-xl font-bold">SignBook</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <a href="#workflow" className="text-gray-600 hover:text-blue-600">Comment ça marche</a>
              <a href="#benefits" className="text-gray-600 hover:text-blue-600">Avantages</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">Tarifs</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Commencer
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#workflow"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Comment ça marche
                </a>
                <a
                  href="#benefits"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Avantages
                </a>
                <a
                  href="#pricing"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tarifs
                </a>
                <button className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
                  Commencer
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Ajout d'un div pour compenser la hauteur du menu fixe */}
      <div className="h-16"></div>

      {/* Dashboard Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Livres</h2>
            <button
              onClick={() => setIsCreatingBook(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Nouveau Livre
            </button>
          </div>

          {/* Grid de livres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <Book size={40} className="text-gray-400" />
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{book.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{book.pages.length} pages</span>
                  <span>Mis à jour le {book.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message si aucun livre */}
          {books.length === 0 && !isCreatingBook && (
            <div className="text-center py-12">
              <Book size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun livre créé</h3>
              <p className="text-gray-600 mb-4">
                Commencez par créer votre premier livre bilingue
              </p>
              <button
                onClick={() => setIsCreatingBook(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Créer mon premier livre
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sections marketing (inchangées) */}
      {/* Workflow Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Comment ça marche ?
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Créez votre premier livre bilingue en quelques étapes simples
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <WorkflowStep
              number="1"
              icon={<LayoutDashboard />}
              title="Créez votre projet"
              description="Choisissez un template et commencez à structurer votre contenu"
            />
            <WorkflowStep
              number="2"
              icon={<Book />}
              title="Ajoutez votre texte"
              description="Rédigez ou importez votre contenu textuel"
            />
            <WorkflowStep
              number="3"
              icon={<Video />}
              title="Intégrez la LSF"
              description="Ajoutez vos vidéos LSF avec synchronisation automatique"
            />
            <WorkflowStep
              number="4"
              icon={<Share2 />}
              title="Publiez et partagez"
              description="Exportez votre livre et partagez-le avec votre audience"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Pourquoi choisir SignBook Creator ?
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Des avantages uniques pour une création de contenu efficace et accessible
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Zap />}
              title="Gain de temps"
              description="Réduisez de 70% le temps de création grâce à nos outils automatisés et notre IA"
            />
            <BenefitCard
              icon={<CheckCircle />}
              title="Qualité professionnelle"
              description="Créez des contenus de qualité professionnelle sans expertise technique"
            />
            <BenefitCard
              icon={<Clock />}
              title="Mise à jour facile"
              description="Modifiez et mettez à jour vos contenus en temps réel"
            />
            <BenefitCard
              icon={<Users />}
              title="Collaboration simplifiée"
              description="Travaillez efficacement avec votre équipe et vos interprètes"
            />
            <BenefitCard
              icon={<Shield />}
              title="Sécurité garantie"
              description="Vos données sont protégées et conformes aux normes RGPD"
            />
            <BenefitCard
              icon={<Trophy />}
              title="Support premium"
              description="Bénéficiez d'un accompagnement personnalisé pour réussir vos projets"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Nos offres
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Des forfaits adaptés à tous les besoins
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Gratuit"
              price="0€"
              period="pour toujours"
              features={[
                "1 projet actif",
                "Fonctionnalités de base",
                "Export PDF simple",
                "Support communautaire"
              ]}
              buttonText="Commencer gratuitement"
              buttonVariant="secondary"
            />
            <PricingCard
              title="Pro"
              price="29€"
              period="par mois"
              features={[
                "Projets illimités",
                "Toutes les fonctionnalités",
                "Export multi-format",
                "Support prioritaire",
                "Collaboration en temps réel"
              ]}
              buttonText="Essai gratuit de 14 jours"
              buttonVariant="primary"
              highlighted={true}
            />
            <PricingCard
              title="Entreprise"
              price="Sur mesure"
              period="par mois"
              features={[
                "Tout Pro +",
                "Déploiement personnalisé",
                "Formation dédiée",
                "API access",
                "SLA garanti"
              ]}
              buttonText="Contactez-nous"
              buttonVariant="secondary"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à créer votre premier livre bilingue ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de créateurs et contribuez à rendre la lecture accessible à tous.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              Commencer gratuitement
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Voir la démo
            </button>
          </div>
        </div>
      </section>

      {/* Reste du code inchangé... */}
    </div>
  );
}

// Composants existants inchangés...

function WorkflowStep({ number, icon, title, description }) {
  return (
    <div className="relative p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition">
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function BenefitCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, period, features, buttonText, buttonVariant, highlighted = false }) {
  return (
    <div className={`p-8 rounded-xl ${highlighted ? 'bg-blue-600 text-white ring-4 ring-blue-300' : 'bg-white'} shadow-lg hover:shadow-xl transition`}>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className={`${highlighted ? 'text-blue-200' : 'text-gray-600'}`}> {period}</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className={`w-5 h-5 ${highlighted ? 'text-blue-200' : 'text-blue-600'} mr-2`} />
            <span className={highlighted ? 'text-blue-100' : 'text-gray-600'}>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-3 rounded-lg font-semibold transition ${
          buttonVariant === 'primary'
            ? 'bg-white text-blue-600 hover:bg-blue-50'
            : highlighted
            ? 'bg-blue-500 text-white hover:bg-blue-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default App;