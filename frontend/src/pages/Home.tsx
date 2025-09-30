// src/pages/Home.tsx
import { Button } from "@progress/kendo-react-buttons";
import { Card, CardBody, CardTitle, CardSubtitle, CardImage, CardActions } from "@progress/kendo-react-layout";
import { Chip } from "@progress/kendo-react-buttons";
import { Link } from "react-router-dom";

export function Home() {
  const categories = ["Markets", "Festivals", "Music", "Sports", "Community"];

  return (
    <main className="mx-auto max-w-6xl p-6 grid gap-8">
      {/* Hero Section */}
      <Card className="overflow-hidden shadow-xl bg-gradient-to-br from-orange-50 to-amber-100">
        <CardImage
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&h=400&fit=crop"
          style={{ height: 400, objectFit: "cover", width: "100%" }} // <-- use style, not "height" prop
        />
        <CardBody className="p-8">
          <CardTitle className="text-4xl font-bold mb-3">
            Discover Darwin & NT Events
          </CardTitle>
          <CardSubtitle className="text-xl mb-6 text-gray-700">
            Markets, festivals, community days and more in the Top End
          </CardSubtitle>

          {/* Replace ChipList children with a simple wrap of Chip items */}
          <div className="flex flex-wrap">
            {categories.map((cat) => (
              <Chip
                key={cat}
                rounded="full"
                fillMode="solid"
                themeColor="info"
                className="mr-2 mb-2"
                text={cat}
              />
            ))}
          </div>
        </CardBody>
        <CardActions>
          <Link to="/events">
            <Button themeColor="primary" size="large" className="w-full sm:w-auto">
              <span className="k-icon k-i-search mr-2" />
              Browse All Events
            </Button>
          </Link>
        </CardActions>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Search Events"
          subtitle="Find by keyword, suburb, or date"
          icon="k-i-search"
          themeColor="primary"
          stats="50+ events this month"
        />
        <QuickActionCard
          title="Propose Event"
          subtitle="Suggest a new local event"
          icon="k-i-plus-circle"
          themeColor="success"
          stats="Community powered"
        />
        <QuickActionCard
          title="Admin Portal"
          subtitle="Manage events & users"
          icon="k-i-gear"
          themeColor="info"
          stats="For organizers"
        />
      </div>

      {/* Featured Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CategoryCard
            title="Sunset Markets"
            image="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=300&fit=crop"
            count={8}
            color="bg-orange-500"
          />
          <CategoryCard
            title="Music & Arts"
            image="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
            count={12}
            color="bg-purple-500"
          />
          <CategoryCard
            title="Sports & Fitness"
            image="https://images.unsplash.com/photo-1502904550040-7534597429ae?w=400&h=300&fit=crop"
            count={15}
            color="bg-blue-500"
          />
          <CategoryCard
            title="Community Events"
            image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop"
            count={10}
            color="bg-green-500"
          />
          <CategoryCard
            title="Festivals"
            image="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop"
            count={6}
            color="bg-pink-500"
          />
          <CategoryCard
            title="Workshops"
            image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
            count={9}
            color="bg-indigo-500"
          />
        </div>
      </section>
    </main>
  );
}

type QuickProps = {
  title: string;
  subtitle: string;
  icon: string; // kendo icon class
  themeColor: "primary" | "success" | "info";
  stats: string;
};

function QuickActionCard({ title, subtitle, icon, themeColor, stats }: QuickProps) {
  // Tailwind doesn't know kendo color names; map them to Tailwind classes explicitly
  const bgMap: Record<QuickProps["themeColor"], string> = {
    primary: "bg-blue-50 text-blue-600",
    success: "bg-green-50 text-green-600",
    info: "bg-cyan-50 text-cyan-600",
  };

  return (
    <Card className="hover:shadow-xl transition-shadow cursor-pointer">
      <CardBody>
        <div className={`mb-4 inline-flex p-3 rounded-lg ${bgMap[themeColor]}`}>
          <span className={`k-icon ${icon} text-2xl`}></span>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardSubtitle className="text-gray-600 mb-3">{subtitle}</CardSubtitle>
        <div className="text-sm font-semibold text-gray-500">{stats}</div>
      </CardBody>
      <CardActions>
        <Button fillMode="flat" themeColor={themeColor} className="w-full">
          Go <span className="k-icon k-i-arrow-right ml-2"></span>
        </Button>
      </CardActions>
    </Card>
  );
}

type CategoryProps = { title: string; image: string; count: number; color: string };

function CategoryCard({ title, image, count, color }: CategoryProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        {/* CardImage has no "height" prop — use style or className */}
        <CardImage src={image} style={{ height: 200, objectFit: "cover", width: "100%" }} />
        <div className={`absolute top-2 right-2 ${color} text-white px-2 py-1 rounded-full text-xs font-bold`}>
          {count} events
        </div>
      </div>
      <CardBody className="p-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardBody>
    </Card>
  );
}
