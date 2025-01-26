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
import { BookEditor } from './components/BookEditor';
import { BookViewer } from './components/BookViewer';

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
  const [isEditingBook, setIsEditingBook] = useState(false);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [activeSection, setActiveSection] = useState('home');

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <HandMetal className="text-blue-600 w-8 h-8 mr-2" />
              <span className="text-blue-600 text-xl font-bold">SignBook</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#accueil"
                onClick={() => setActiveSection('home')}
                className={`text-gray-600 hover:text-blue-600 ${activeSection === 'home' ? 'text-blue-600' : ''}`}
              >
                Accueil
              </a>
              <a 
                href="#comment-ca-marche"
                onClick={() => setActiveSection('how')}
                className={`text-gray-600 hover:text-blue-600 ${activeSection === 'how' ? 'text-blue-600' : ''}`}
              >
                Comment ça marche
              </a>
              <a 
                href="#tarifs"
                onClick={() => setActiveSection('pricing')}
                className={`text-gray-600 hover:text-blue-600 ${activeSection === 'pricing' ? 'text-blue-600' : ''}`}
              >
                Tarifs
              </a>
              <a 
                href="#mes-livres"
                onClick={() => setActiveSection('books')}
                className={`text-gray-600 hover:text-blue-600 ${activeSection === 'books' ? 'text-blue-600' : ''}`}
              >
                Mes livres
              </a>
              <button
                onClick={() => setIsCreatingBook(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer un livre
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
            <div className="md:hidden py-4">
              <a href="#accueil" className="block py-2 text-gray-600 hover:text-blue-600">Accueil</a>
              <a href="#comment-ca-marche" className="block py-2 text-gray-600 hover:text-blue-600">Comment ça marche</a>
              <a href="#tarifs" className="block py-2 text-gray-600 hover:text-blue-600">Tarifs</a>
              <a href="#mes-livres" className="block py-2 text-gray-600 hover:text-blue-600">Mes livres</a>
              <button
                onClick={() => setIsCreatingBook(true)}
                className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Créer un livre
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Espacement pour le menu fixe */}
      <div className="h-16"></div>

      {/* Hero Section */}
      <section id="accueil" className="bg-gradient-to-b from-blue-50 to-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Créez des livres bilingues accessibles
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Transformez vos histoires en livres bilingues avec traduction en langue des signes
          </p>
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => setIsCreatingBook(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Commencer gratuitement
            </button>
            <a
              href="#comment-ca-marche"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section id="comment-ca-marche" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Comment ça marche ?</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Créez votre premier livre bilingue en quelques étapes simples
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Créez votre projet</h3>
              <p className="text-gray-600">Choisissez un template et commencez à structurer votre contenu</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Ajoutez votre texte</h3>
              <p className="text-gray-600">Rédigez ou importez votre contenu textuel</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Intégrez la LSF</h3>
              <p className="text-gray-600">Ajoutez vos vidéos LSF avec synchronisation automatique</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">4. Publiez</h3>
              <p className="text-gray-600">Exportez votre livre et partagez-le avec votre audience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Ce qu'en disent nos utilisateurs</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Découvrez comment SignBook aide à rendre la lecture accessible à tous
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Marie L.</h3>
                  <p className="text-gray-600">Enseignante spécialisée</p>
                </div>
              </div>
              <p className="text-gray-600">
                "SignBook m'a permis de créer des supports pédagogiques adaptés pour mes élèves. Un outil indispensable !"
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Thomas R.</h3>
                  <p className="text-gray-600">Parent</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Grâce à SignBook, je peux enfin partager des histoires avec mon enfant malentendant."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Sophie M.</h3>
                  <p className="text-gray-600">Auteure</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Un outil intuitif qui m'a permis de rendre mes livres accessibles à un public plus large."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Mes Livres */}
      <section id="mes-livres" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mes Livres</h2>
            {books.length === 0 ? (
              <p className="text-gray-600 mb-8">
                Vous n'avez pas encore créé de livre ? C'est le moment de commencer !
              </p>
            ) : (
              <button
                onClick={() => setIsCreatingBook(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer un nouveau livre
              </button>
            )}
          </div>

          {books.length === 0 ? (
            <div className="text-center">
              <button
                onClick={() => setIsCreatingBook(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Créer mon premier livre
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                    <p className="text-gray-600 mb-4">{book.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBook(book);
                            setIsEditingBook(true);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setViewingBook(book)}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                        >
                          Voir
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">SignBook</h3>
              <p className="text-gray-400">
                Rendons la lecture accessible à tous grâce à la langue des signes.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><a href="#accueil" className="text-gray-400 hover:text-white">Accueil</a></li>
                <li><a href="#comment-ca-marche" className="text-gray-400 hover:text-white">Comment ça marche</a></li>
                <li><a href="#tarifs" className="text-gray-400 hover:text-white">Tarifs</a></li>
                <li><a href="#mes-livres" className="text-gray-400 hover:text-white">Mes livres</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ressources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tutoriels</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">contact@signbook.fr</li>
                <li className="text-gray-400">01 23 45 67 89</li>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <MessageSquare className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <Cloud className="w-6 h-6" />
                  </a>
                </div>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SignBook. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isCreatingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <BookEditor
              onSave={handleCreateBook}
              onCancel={() => setIsCreatingBook(false)}
            />
          </div>
        </div>
      )}

      {isEditingBook && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <BookEditor
              initialBook={selectedBook}
              onSave={(updatedBook) => {
                handleUpdateBook({ ...updatedBook, id: selectedBook.id });
                setIsEditingBook(false);
                setSelectedBook(null);
              }}
              onCancel={() => {
                setIsEditingBook(false);
                setSelectedBook(null);
              }}
            />
          </div>
        </div>
      )}

      {viewingBook && (
        <BookViewer
          book={viewingBook}
          onClose={() => setViewingBook(null)}
        />
      )}
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