import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { H1Card } from "@/components/h1-card"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <H1Card>About Dessert Print Inc</H1Card>
        <p className="max-w-[700px] text-rose-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Our story, mission, and passion for creating delicious edible art
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="rounded-[49px] overflow-hidden bg-gradient-to-r from-rose-600 to-amber-500 p-1 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
          <Image
            src="/placeholder.svg?key=z2vnm"
            alt="Our Kitchen"
            width={600}
            height={600}
            className="rounded-[48px] object-cover w-full aspect-square"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter rose-gold-text">Our Story</h2>
          <p className="text-lg text-gray-700">
            Dessert Print Inc was born from a simple yet powerful idea: to transform ordinary treats into extraordinary
            memories. What started as a passion project in a small kitchen has grown into a luxury edible printing
            business that serves customers nationwide.
          </p>
          <p className="text-lg text-gray-700">
            Our founder, a pastry chef with over 15 years of experience, combined traditional baking techniques with
            cutting-edge food printing technology to create something truly unique. The result? Stunningly beautiful and
            delicious custom cookies and chocolate bars that have become the centerpiece of countless celebrations.
          </p>
          <p className="text-lg text-gray-700">
            Today, we continue to push the boundaries of what's possible with edible printing, constantly innovating and
            refining our techniques to deliver the highest quality products to our customers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="order-2 lg:order-1 space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter rose-gold-text">Our Mission</h2>
          <p className="text-lg text-gray-700">
            At Dessert Print Inc, our mission is to create edible art that brings joy, wonder, and a touch of luxury to
            life's special moments. We believe that celebrations deserve to be as unique as the people enjoying them.
          </p>
          <p className="text-lg text-gray-700">
            We're committed to using only the finest ingredients, sourced responsibly and prepared with care. Our
            dedication to quality extends to every aspect of our business, from the first design consultation to the
            final delivery.
          </p>
          <p className="text-lg text-gray-700">
            We strive to provide exceptional customer service, working closely with each client to bring their vision to
            life. Whether it's a wedding, birthday, corporate event, or any other celebration, we're here to make it
            unforgettable.
          </p>
        </div>
        <div className="order-1 lg:order-2 rounded-[49px] overflow-hidden bg-gradient-to-r from-rose-600 to-amber-500 p-1 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
          <Image
            src="/placeholder.svg?key=17iql"
            alt="Our Products"
            width={600}
            height={600}
            className="rounded-[48px] object-cover w-full aspect-square"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold tracking-tighter text-center rose-gold-text mb-12">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-rose-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-rose-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Design</h3>
              <p className="text-gray-700">
                We start with your vision. Upload your own image or choose from our gallery. Our design team will work
                with you to create the perfect custom treat.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-rose-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-rose-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create</h3>
              <p className="text-gray-700">
                Our skilled bakers prepare your cookies or chocolate bars using premium ingredients. We then use our
                state-of-the-art edible printing technology to bring your design to life.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-rose-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-rose-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Deliver</h3>
              <p className="text-gray-700">
                We carefully package your custom treats to ensure they arrive in perfect condition. Whether it's a small
                order or a large event, we deliver on time and with care.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter rose-gold-text mb-6">Meet Our Team</h2>
        <p className="max-w-[700px] mx-auto text-gray-700 mb-12">
          The talented individuals behind our delicious creations
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Founder & Head Baker",
              image: "/placeholder.svg?key=wwa6c",
            },
            {
              name: "Michael Rodriguez",
              role: "Lead Designer",
              image: "/placeholder.svg?key=tkci4",
            },
            {
              name: "Emily Chen",
              role: "Pastry Chef",
              image: "/placeholder.svg?key=vm67s",
            },
            {
              name: "David Wilson",
              role: "Operations Manager",
              image: "/placeholder.svg?key=7o7yp",
            },
          ].map((member, index) => (
            <Card
              key={index}
              className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]"
            >
              <CardContent className="p-6 text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-rose-600 mb-4">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="rounded-[49px] overflow-hidden bg-gradient-to-r from-rose-600 to-amber-500 p-1 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3] mb-16">
        <Card className="rounded-[48px] border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold tracking-tighter rose-gold-text mb-6">Ready to Create Your Own?</h2>
            <p className="max-w-[700px] mx-auto text-gray-700 mb-8">
              Design your perfect custom cookies or chocolate bars today and make your next celebration unforgettable.
            </p>
            <Link href="/design">
              <Button className="btn-luxury text-white px-8 py-6 text-lg font-bold">Start Designing Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
