<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		const { SplitText } = await import('gsap/SplitText');

		gsap.registerPlugin(ScrollTrigger, SplitText);

		// Scale animation from corner for section elements
		ScrollTrigger.create({
			trigger: '.about-us-hero',
			start: 'top top',
			end: '+=150%',
			scrub: 1.5,
			pin: '.about-us-hero',
			markers: true,
			// pinSpacing: false,
			onUpdate: (self) => {
				const headline = document.querySelector('.about-us-hero h1');
				const mockupImage = document.querySelector('.about-us-hero .mockup-image');
				const contentWrapper = document.querySelector('.about-us-hero .content-wrapper');
				const progress = self.progress; // Get scroll progress (0 to 1)

				// Animate headline width from 100% to 50%
				gsap.set(headline, {
					width: `${100 - progress * 50}%`, // Width from 100% to 50%
					fontSize: `${3 - progress}rem`, // Scale from 1 to 0.7 as you scroll
					// scale: 1 - progress * 0.3, // Scale from 1 to 0.7 as you scroll
					// opacity: 1 - progress * 0.5, // Fade out slightly
					transformOrigin: 'top left', // Scale from top left corner
					ease: 'none'
				});

				// Reveal mockup image
				gsap.set(mockupImage, {
					opacity: progress < 0.5 ? 0 : progress, // Fade in as you scroll
					width: `${progress * 50}%`, // Width from 0% to 50%
					x: (1 - progress) * 100, // Slide in from right
					y: (1 - progress) * 100, // Slide in from right
					ease: 'none'
				});

				console.log(self.direction);
			}
		});

		ScrollTrigger.refresh();

		// Cleanup
		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<section class="about-us-hero tofu-canvas-trigger flex h-dvh p-[5%]">
	<h1 itemprop="headline" class="text-dark-50 w-full bg-blue-500" style="font-size: 3rem;">
		Welcome to TOFU FOR US! We're a team passionate about bringing the pure, wholesome goodness of
		expertly crafted tofu from our kitchen to yours. For us, tofu is more than just food; it's a
		versatile source of nourishment, a canvas for culinary creativity, and a tradition we're proud
		to share.
	</h1>
	<div
		class="mockup-image flex h-full items-center justify-center bg-red-500 opacity-0"
		style="width: 0%;"
	>
		INI BAKAL JADI IMAGE ILUSTRASI
	</div>
</section>

<section
	id="our-story"
	class="about-section grid h-dvh grid-cols-2 p-[5%]"
	itemprop="articleSection"
>
	<div class="flex h-full w-full items-center justify-center bg-red-500">
		INI BAKAL JADI IMAGE ILUSTRASI
	</div>
	<div itemprop="articleBody" class="text-dark-50 text-2xl">
		<p>
			TOFU FOR US was born in <time datetime="2018">2018</time> from a simple yet profound love for authentic,
			high-quality tofu. It started with a desire to share the incredible taste and health benefits we
			cherished, envisioning a tofu that was not only delicious but also made with unwavering integrity
			and the finest natural ingredients. What began as a humble endeavor, rooted in family recipes passed
			down through generations, has grown into a commitment to deliver a product that we, and you, can
			trust and enjoy every day.
		</p>
	</div>
</section>

<section
	id="our-mission"
	class="about-section grid h-dvh grid-cols-2 p-[5%]"
	itemprop="articleSection"
>
	<div itemprop="articleBody">
		<p class="text-dark-50 text-2xl">
			Our mission is to be your go-to source for premium tofu. We aim to achieve this by
			consistently providing a product that is:
		</p>
		<ul class="feature-list text-dark-50 list-decimal text-lg">
			<li>
				<strong>Nutritious & Wholesome:</strong> Made from carefully selected, non-GMO soybeans, sustainably
				sourced from dedicated local farms in West Java, processed to retain maximum nutritional value.
			</li>
			<li>
				<strong>Deliciously Versatile:</strong> Boasting an authentic, clean taste and a perfect texture
				that shines in a wide array of dishes.
			</li>
			<li>
				<strong>Pure & Simple:</strong> Crafted without unnecessary artificial preservatives or colors,
				ensuring a natural and trustworthy product.
			</li>
			<li>
				<strong>Made For You:</strong> Accessible and created with our community (that's you!) in mind.
			</li>
		</ul>
	</div>
	<div class="flex h-full w-full items-center justify-center bg-red-500">
		INI BAKAL JADI IMAGE ILUSTRASI
	</div>
</section>

<section
	id="our-values"
	class="about-section grid h-dvh grid-cols-2 p-[5%]"
	itemprop="articleSection"
>
	<div class="flex h-full w-full items-center justify-center bg-red-500">
		INI BAKAL JADI IMAGE ILUSTRASI
	</div>
	<div itemprop="articleBody">
		<p>At TOFU FOR US, our work is guided by these core values:</p>
		<ul class="feature-list text-dark-50 list-decimal text-lg">
			<li>
				<strong>Uncompromising Quality:</strong> From the choice of soybeans to our meticulous crafting
				process, excellence is at the heart of what we do.
			</li>
			<li>
				<strong>Health & Wellbeing:</strong> We believe in the power of good food to nurture, and our
				tofu is a testament to this belief.
			</li>
			<li>
				<strong>Authenticity & Craftsmanship:</strong> We honor traditional tofu-making techniques, refined
				over years, while embracing innovations that enhance our product's quality and taste.
			</li>
			<li>
				<strong>Sustainability:</strong> We are dedicated to responsible sourcing, minimizing our environmental
				footprint, and supporting our local farming communities. This includes water conservation in
				our processes and using eco-friendly packaging where possible.
			</li>
			<li>
				<strong>Customer Connection:</strong> Your satisfaction inspires us. We value your feedback and
				strive to create products that bring joy to your meals.
			</li>
		</ul>
	</div>
</section>

<section
	id="why-choose-us"
	class="about-section grid h-dvh grid-cols-2 p-[5%]"
	itemprop="articleSection"
>
	<div itemprop="articleBody">
		<p>
			We believe that exceptional tofu begins with exceptional ingredients. At TOFU FOR US, we use
			only <strong
				>premium, non-GMO Grade A soybeans sourced from the fertile lands of West Java,</strong
			>
			pure filtered water, and a <strong>refined traditional process</strong> that has been perfected
			over time. This dedication results in tofu with a delightfully smooth yet satisfyingly firm texture,
			a naturally savory flavor, and an excellent ability to absorb the spices and sauces of your favorite
			recipes. We take pride in offering a clean-label product, so you can enjoy the pure, unadulterated
			goodness of expertly made tofu.
		</p>
	</div>
	<div class="flex h-full w-full items-center justify-center bg-red-500">
		INI BAKAL JADI IMAGE ILUSTRASI
	</div>
</section>

<section
	id="our-commitment"
	class="about-section grid h-dvh grid-cols-2 p-[5%]"
	itemprop="articleSection"
>
	<div class="flex h-full w-full items-center justify-center bg-red-500">
		INI BAKAL JADI IMAGE ILUSTRASI
	</div>
	<div itemprop="articleBody">
		<p>
			Our promise to you is simple: to uphold the highest standards in every block of TOFU FOR US
			tofu. We ensure that from our facility to your kitchen, the freshness, quality, and care we
			put into our tofu remain paramount.
		</p>
	</div>
</section>

<section
	id="join-us"
	class="about-section call-to-action grid h-dvh grid-cols-2 p-[5%]"
	itemprop="articleSection"
>
	<div itemprop="articleBody">
		<p>
			Thank you for taking the time to learn more about us. We invite you to <a
				href="/products"
				aria-label="View our tofu products">explore our range of tofu products</a
			> and experience the distinct quality and taste of TOFU FOR US. We're excited to be a part of your
			healthy, delicious meals.
		</p>
		<p>Let's enjoy great tofu, together!</p>
	</div>
	<div class="flex h-full w-full items-center justify-center bg-red-500">
		INI BAKAL JADI IMAGE ILUSTRASI
	</div>
</section>
