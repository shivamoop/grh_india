/**
 * GRH INDIA — NEXT-GENERATION ENTERPRISE JAVASCRIPT ENGINE
 * Handles: Scroll animations, Dynamic Counters, Clinical Matcher Engine,
 * Radar Hub Telemetry, Filterable Portfolio, Spec Modals & Requisition.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. NAVBAR SCROLL STATE & BACK TO TOP BUTTON
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active navigation link tracking via IntersectionObserver
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => navObserver.observe(sec));


  // =========================================================================
  // 2. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const mobileDrawerCta = document.getElementById('mobile-drawer-cta');

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeDrawer);

    mobileNavItems.forEach(item => {
      item.addEventListener('click', closeDrawer);
    });

    if (mobileDrawerCta) {
      mobileDrawerCta.addEventListener('click', () => {
        closeDrawer();
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }


  // =========================================================================
  // 3. STAT COUNTERS ANIMATION
  // =========================================================================
  const counterElements = document.querySelectorAll('.counter-number');
  let hasCounted = false;

  const countUp = (el, target, duration = 1800) => {
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
      el.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(animate);
  };

  const statsSection = document.querySelector('.stats-ribbon');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (!isNaN(target)) {
              countUp(counter, target);
            }
          });
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
  }


  // =========================================================================
  // 4. INTERACTIVE CLINICAL WOUND CARE MATCHER (TRIAGE ENGINE)
  // =========================================================================
  const indicationButtons = document.querySelectorAll('.indication-btn');
  const thicknessButtons = document.querySelectorAll('.thickness-btn');
  const matcherTitle = document.getElementById('matcher-product-title');
  const matcherSub = document.getElementById('matcher-product-sub');
  const matcherSpecsList = document.getElementById('matcher-specs-list');
  const matcherTipText = document.getElementById('matcher-tip-text');

  let currentIndication = 'burns';
  let currentThickness = '1mm';

  const clinicalDatabase = {
    'burns_1mm': {
      title: 'MatriDerm® 1mm Dermal Matrix',
      sub: 'Single-Stage Simultaneous Skin Grafting Protocol (STSG)',
      tip: 'For full-thickness burn excision, 1mm MatriDerm combined simultaneously with STSG offers rapid neovascularization with up to 95% graft take rate.',
      specs: [
        'Allows simultaneous STSG graft application in a single surgical session.',
        'Porous 3D cross-linked collagen-elastin structure promotes rapid cellular migration.',
        'Significantly minimizes secondary joint contractures and hypertrophic scarring.',
        'Reduces hospital length of stay and repeat surgical revisions.'
      ]
    },
    'burns_2mm': {
      title: 'MatriDerm® 2mm Scaffold Matrix',
      sub: 'Two-Stage Deep Contour & High Mechanical Load Protocol',
      tip: 'Indicated for extensive full-thickness burns requiring greater neodermis thickness, load-bearing anatomical sites, or delayed secondary autografting.',
      specs: [
        'Provides enhanced neodermis volume in deep third-degree thermal injuries.',
        'Engineered for maximum tensile strength on joint surfaces, hands, and neck.',
        'Integrates with Negative Pressure Wound Therapy (NPWT) for superior bed prep.',
        'Biocompatible native bovine collagen with hydrolysed alpha-elastin.'
      ]
    },
    'burns_fenestrated': {
      title: 'MatriDerm® Fenestrated / Flex Matrix',
      sub: 'High Exudate Drainage & Dynamic Contour Bed Protocol',
      tip: 'Precision micro-fenestrations facilitate effortless wound drainage, avoiding seroma formation beneath the dermal scaffold.',
      specs: [
        'Pre-fenestrated design facilitates seamless fluid and hematoma egress.',
        'Conforms smoothly across irregular body contours, flexing without tearing.',
        'Optimal for extensive body surface area (TBSA) thermal reconstructive procedures.',
        'Sterile single-use packaging with ready-to-hydrate ease in saline.'
      ]
    },
    'dfu_1mm': {
      title: 'ProHeal® Bioactive Matrix + MatriDerm® 1mm',
      sub: 'Diabetic Foot Ulcer Bed Regeneration & Closure Protocol',
      tip: 'Ensure thorough debridement and off-loading before applying matrix. Promotes granulation over exposed tendon and periosteum.',
      specs: [
        'Stimulates capillary budding and activates native fibroblast deposition.',
        'Protects exposed tendons and prevents deep osteomyelitis progression.',
        'Exudate-balancing bioactive matrix maintains optimal moist healing environment.',
        'Substantially shortens chronic closure time and mitigates limb amputation risk.'
      ]
    },
    'dfu_2mm': {
      title: 'MatriDerm® 2mm Deep Cavity Protocol',
      sub: 'Deep Plantar Ulceration & Tissue Defect Reconstruction',
      tip: 'Ideal for deep plantar defects where substantial tissue loss requires structural cushion.',
      specs: [
        'Provides robust subcutaneous structural padding beneath weight-bearing soles.',
        'Facilitates robust tissue bridge across non-vascular bone margins.',
        'Compatible with biological offloading boots and advanced NPWT dressings.',
        'High clinical success across chronic refractory diabetic wound centers.'
      ]
    },
    'dfu_fenestrated': {
      title: 'ProHeal® Drainage Matrix & Fenestrated Template',
      sub: 'Exudative Ulcer Management & Granulation Protocol',
      tip: 'Recommended when moderate-to-heavy wound drainage is present in infected or neuropathic wounds.',
      specs: [
        'Facilitates high moisture vapor transmission rate (MVTR).',
        'Prevents maceration of periwound skin edges.',
        'Combats bacterial colonization via sustained matrix hydration.',
        'Accelerates epithelial advancement from the wound borders.'
      ]
    },
    'reconstruction_1mm': {
      title: 'MatriDerm® 1mm Aesthetic Reconstruction Matrix',
      sub: 'Burn Scar Contracture Release & Oncologic Defect Reconstruction',
      tip: 'After surgical release of neck, axilla, or flexion creases, 1mm MatriDerm restores skin suppleness and full range of motion.',
      specs: [
        'Restores natural skin elasticity and pliability in functional flexion zones.',
        'Demonstrates superior histological skin quality matching native dermal architecture.',
        'Minimizes donor site harvesting morbidity with thinner split-thickness grafts.',
        'Gold standard choice for pediatric and adult plastic reconstructive surgery.'
      ]
    },
    'reconstruction_2mm': {
      title: 'MatriDerm® 2mm Reconstructive Template',
      sub: 'Complex Contour Restoration & Post-Tumor Resection',
      tip: 'Restores soft-tissue volume following sarcoma or basal cell carcinoma excision where flap surgery is contraindicated.',
      specs: [
        'Replaces substantial dermal thickness without demanding complex microvascular free flaps.',
        'Excellent cosmetic contouring in facial, scalp, and torso reconstructions.',
        'Provides protective barrier over exposed calvarium and cartilage.',
        'High take rates even in elderly or comorbid oncologic patients.'
      ]
    },
    'reconstruction_fenestrated': {
      title: 'MatriDermflex Reconstructive Mesh',
      sub: 'Dynamic Articular Reconstruction & Curved Defect Protocol',
      tip: 'Engineered with bi-directional stretch capability for joints, elbows, and rounded surfaces.',
      specs: [
        'Conforms precisely over complex 3D convex and concave anatomical curvatures.',
        'Eliminates tenting and dead space under the autograft.',
        'Enhances surgical ease in tight aesthetic and reconstructive planes.',
        'Over 15 years of surgical validation across top European and Indian centers.'
      ]
    },
    'trauma_1mm': {
      title: 'MatriDerm® 1mm Acute Trauma Matrix',
      sub: 'High-Energy Degloving & Traumatic Soft Tissue Loss',
      tip: 'Apply in emergency theater within 24-48 hours after clear surgical margin debridement.',
      specs: [
        'Converts complex open musculoskeletal wounds into single-stage graftable beds.',
        'Covers exposed paratenon and periosteum with rapid capillary growth.',
        'Reduces donor site harvesting requirements by up to 50%.',
        'Proven in road traffic accidents, industrial crush injuries, and defense trauma.'
      ]
    },
    'trauma_2mm': {
      title: 'MatriDerm® 2mm Heavy Trauma Scaffold',
      sub: 'Extensive Musculoskeletal Defect & Blast Injury Management',
      tip: 'Designed for high-impact limb salvage cases where significant subcutaneous layer is destroyed.',
      specs: [
        'Provides heavy-duty biological scaffold resisting sheer forces.',
        'Prevents graft adherence to underlying sliding structures.',
        'Supports stable, durable long-term skin envelope able to withstand friction.',
        'Extensively used across military hospitals and apex trauma institutions.'
      ]
    },
    'trauma_fenestrated': {
      title: 'MatriDerm® Fenestrated Trauma Solution',
      sub: 'Traumatic Wound Drainage & High Output Management',
      tip: 'Allows continuous vacuum aspiration under NPWT without clogging or fluid pooling.',
      specs: [
        'Compatible with negative pressure wound therapy up to -125 mmHg.',
        'Avoids hematoma accumulation under high-risk traumatic grafts.',
        'Accelerates stable wound closure in contaminated trauma environments.',
        'Supplied sterile in moisture-barrier blister packs.'
      ]
    }
  };

  const updateMatcherDisplay = () => {
    const key = `${currentIndication}_${currentThickness}`;
    const data = clinicalDatabase[key] || clinicalDatabase['burns_1mm'];

    if (matcherTitle) matcherTitle.textContent = data.title;
    if (matcherSub) matcherSub.textContent = data.sub;
    if (matcherTipText) matcherTipText.textContent = data.tip;

    if (matcherSpecsList) {
      matcherSpecsList.innerHTML = data.specs
        .map(spec => `
          <li class="result-detail-item">
            <i class="fas fa-check"></i>
            <span>${spec}</span>
          </li>
        `).join('');
    }
  };

  indicationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      indicationButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentIndication = btn.getAttribute('data-indication');
      updateMatcherDisplay();
    });
  });

  thicknessButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      thicknessButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentThickness = btn.getAttribute('data-thickness');
      updateMatcherDisplay();
    });
  });


  // =========================================================================
  // 5. FILTERABLE MEDICAL PORTFOLIO
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // =========================================================================
  // 6. PAN-INDIA LOGISTICS RADAR & TELEMETRY
  // =========================================================================
  const hubItems = document.querySelectorAll('.hub-item');
  const hudTitle = document.getElementById('hud-hub-title');
  const hudDesc = document.getElementById('hud-hub-desc');

  const hubData = {
    gurugram: {
      title: 'Gurugram Corporate Headquarters & NCR Logistics Hub',
      desc: '406 Global Foyer, Golf Course Road, Sector 43. Central command center managing clinical partnerships, regulatory affairs, and Northern India hospital supply.'
    },
    delhi: {
      title: 'New Delhi National Distribution & Cold Chain Terminal',
      desc: 'Dedicated sterile cold-storage terminal providing same-day urgent dispatch to AIIMS, Safdarjung, Army R&R, Apollo, and North Indian medical centers.'
    },
    mumbai: {
      title: 'Mumbai Western Regional Distribution Hub',
      desc: 'Supplying Maharashtra, Gujarat, and Goa. Next-flight emergency matrix delivery available for trauma and emergency reconstructive burn operations.'
    },
    bengaluru: {
      title: 'Bengaluru Southern Clinical & Logistics Center',
      desc: 'Covers Karnataka, Tamil Nadu, Telangana, Andhra Pradesh & Kerala. Clinical field specialists stationed on-ground for surgeon support and workshops.'
    }
  };

  window.activateHub = (hubKey) => {
    const data = hubData[hubKey];
    if (data && hudTitle && hudDesc) {
      hudTitle.textContent = data.title;
      hudDesc.textContent = data.desc;
    }

    hubItems.forEach(item => {
      if (item.getAttribute('onclick')?.includes(hubKey)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };


  // =========================================================================
  // 7. SPECIFICATION MODALS & QUICK PREVIEWS
  // =========================================================================
  const specModal = document.getElementById('spec-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalBodyContent = document.getElementById('modal-body-content');

  const modalDatabase = {
    matriderm: {
      title: 'MatriDerm® Dermal Matrix — Complete Clinical Monograph',
      sub: 'MedSkin Solutions Dr. Suwelack AG (Germany) & GRH India Distribution',
      html: `
        <div style="display: flex; gap: 1.5rem; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap;">
          <img src="assets/grh_official_distributor_matriderm_clean_light.png" alt="GRH Official Distributor of MatriDerm in India" style="max-height: 52px; width: auto; object-fit: contain;">
          <img src="assets/hex-portfolio-matriderm-classic_2021-05-20-142453.webp" style="max-height: 60px; width: auto; object-fit: contain;">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <strong style="font-size: 0.8125rem; color: var(--navy); display: block;">Available Thicknesses</strong>
            <span style="font-size: 0.875rem; color: #475569;">1 mm (Classic), 2 mm, Fenestrated, Flex</span>
          </div>
          <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <strong style="font-size: 0.8125rem; color: var(--navy); display: block;">Composition</strong>
            <span style="font-size: 0.875rem; color: #475569;">Native Bovine Collagen Types I, III, V + Alpha-Elastin</span>
          </div>
        </div>

        <h5 style="color: var(--navy); font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Key Clinical Indications</h5>
        <ul style="list-style: disc; padding-left: 1.25rem; color: #475569; font-size: 0.875rem; line-height: 1.6; margin-bottom: 1.5rem;">
          <li>Severe thermal injuries & full-thickness burn excision.</li>
          <li>Burn scar contracture releases across flexor joints, neck, and hands.</li>
          <li>Reconstructive surgery following oncological skin cancer excision.</li>
          <li>Degloving trauma injuries with exposed tendon or bone periosteum.</li>
          <li>Refractory chronic diabetic foot and venous stasis ulcers.</li>
        </ul>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="https://www.grhindia.in/_files/ugd/ce3761_f377b43b07f4446da9f1e68eb15dfe5a.pdf" target="_blank" rel="noopener" class="btn btn-teal" style="font-size: 0.875rem;">
            <i class="fas fa-file-pdf"></i> Download Official Brochure
          </a>
          <a href="https://www.grhindia.in/_files/ugd/ce3761_a36e5cb9407449dc8cbafab056f4dfc0.pdf" target="_blank" rel="noopener" class="btn btn-navy" style="font-size: 0.875rem;">
            <i class="fas fa-book"></i> View Clinical Bibliography (150+ Papers)
          </a>
        </div>
      `
    },
    proheal: {
      title: 'ProHeal® Advanced Wound Management — Clinical Overview',
      sub: 'Bioactive Matrix & Moisture Balance for Chronic Refractory Wounds',
      html: `
        <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid #e2e8f0;">
          <img src="assets/matriderm-post.jpeg" style="max-height: 80px; width: 80px; object-fit: cover; border-radius: 8px;">
          <div>
            <h4 style="color: var(--navy); font-size: 1.15rem; font-weight: 800;">Targeted Healing for Complex & Stagnant Wounds</h4>
            <span style="font-size: 0.8125rem; color: #0284c7; font-weight: 700;"><i class="fas fa-shield-alt"></i> Distributed Nationally by GRH India</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <strong style="font-size: 0.8125rem; color: var(--navy); display: block;">Mechanism</strong>
            <span style="font-size: 0.875rem; color: #475569;">Matrix Metalloproteinase (MMP) Modulation</span>
          </div>
          <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <strong style="font-size: 0.8125rem; color: var(--navy); display: block;">Target Outcomes</strong>
            <span style="font-size: 0.875rem; color: #475569;">Granulation Tissue Proliferation & Edge Advancement</span>
          </div>
        </div>

        <h5 style="color: var(--navy); font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Clinical Benefits</h5>
        <ul style="list-style: disc; padding-left: 1.25rem; color: #475569; font-size: 0.875rem; line-height: 1.6; margin-bottom: 1.5rem;">
          <li>Transforms non-healing stagnant wounds back into active proliferative phase.</li>
          <li>Maintains moisture equilibrium and regulates heavy exudate discharge.</li>
          <li>Atraumatic removal significantly improves patient comfort during dressing changes.</li>
          <li>Cost-effective institutional options with the new 5% GST rate applied.</li>
        </ul>

        <div style="display: flex; gap: 1rem;">
          <button class="btn btn-teal" style="font-size: 0.875rem;" onclick="requestProductQuote('ProHeal®')">
            <i class="fas fa-handshake"></i> Request Clinical Evaluation Kit
          </button>
        </div>
      `
    }
  };

  window.openSpecModal = (type) => {
    const data = modalDatabase[type] || modalDatabase['matriderm'];
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSubtitle) modalSubtitle.textContent = data.sub;
    if (modalBodyContent) modalBodyContent.innerHTML = data.html;
    if (specModal) specModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeSpecModal = () => {
    if (specModal) specModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (specModal) {
    specModal.addEventListener('click', (e) => {
      if (e.target === specModal) closeSpecModal();
    });
  }

  const quickSpecBtn = document.getElementById('quick-spec-btn');
  if (quickSpecBtn) {
    quickSpecBtn.addEventListener('click', () => {
      window.openSpecModal('matriderm');
    });
  }

  const heroSampleModalBtn = document.getElementById('hero-sample-modal-btn');
  if (heroSampleModalBtn) {
    heroSampleModalBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const nameField = document.getElementById('full-name');
        if (nameField) nameField.focus();
      }
    });
  }

  window.requestProductQuote = (productName) => {
    window.closeSpecModal();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const productSelect = document.getElementById('product-interest');
      if (productSelect) {
        for (let i = 0; i < productSelect.options.length; i++) {
          if (productSelect.options[i].text.toLowerCase().includes(productName.toLowerCase())) {
            productSelect.selectedIndex = i;
            break;
          }
        }
      }
      const messageField = document.getElementById('message-content');
      if (messageField) {
        messageField.value = `Inquiring about institutional procurement and surgeon samples for ${productName}.`;
        messageField.focus();
      }
    }
  };


  // =========================================================================
  // 8. GST SAVINGS CALCULATOR MODAL
  // =========================================================================
  window.openGstCalculator = () => {
    if (modalTitle) modalTitle.textContent = 'Hospital Wound Care GST Reform Savings Calculator';
    if (modalSubtitle) modalSubtitle.textContent = 'Quantify direct savings from 12% to 5% GST Reduction';
    if (modalBodyContent) {
      modalBodyContent.innerHTML = `
        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 1.5rem;">
          <label style="font-size: 0.875rem; font-weight: 700; color: var(--navy); display: block; margin-bottom: 0.5rem;">
            Estimated Monthly Hospital Wound Care & Dermal Matrix Spend (₹ in Lakhs):
          </label>
          <div style="display: flex; gap: 0.75rem;">
            <input type="number" id="calc-spend-input" value="10" min="1" max="500" class="form-input" style="font-size: 1.15rem; font-weight: 700;">
            <button class="btn btn-teal" onclick="calculateSavings()">
              Calculate
            </button>
          </div>
        </div>

        <div id="calc-results-display" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: center; margin-bottom: 1.5rem;">
          <div style="background: rgba(30, 184, 201, 0.08); border: 1.5px solid var(--teal); padding: 1.25rem; border-radius: 10px;">
            <span style="font-size: 0.75rem; color: var(--navy); font-weight: 700; text-transform: uppercase;">Direct Monthly Savings</span>
            <div id="monthly-savings-num" style="font-size: 1.75rem; font-weight: 900; color: var(--teal); font-family: var(--font-heading);">
              ₹ 70,000
            </div>
            <span style="font-size: 0.75rem; color: var(--navy);">Passed to patients & institution</span>
          </div>

          <div style="background: rgba(26, 69, 120, 0.06); border: 1.5px solid var(--navy); padding: 1.25rem; border-radius: 10px;">
            <span style="font-size: 0.75rem; color: var(--navy); font-weight: 700; text-transform: uppercase;">Annual Budget Relief</span>
            <div id="annual-savings-num" style="font-size: 1.75rem; font-weight: 900; color: var(--navy); font-family: var(--font-heading);">
              ₹ 8,40,000
            </div>
            <span style="font-size: 0.75rem; color: var(--navy);">Per annum savings</span>
          </div>
        </div>

        <p style="font-size: 0.8125rem; color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
          *Under the Central Drugs Standard Control Organization (CDSCO) directive effective September 22, 2025, GST on wound care and medical devices decreased from 12% to 5%. GRH ensures 100% of this tax rationalization benefit is reflected in all institutional rate contracts.
        </p>

        <button class="btn btn-navy" style="width: 100%;" onclick="requestProductQuote('GST 5% Contract')">
          <i class="fas fa-file-contract"></i> Inquire Revised Hospital Rate Contract
        </button>
      `;
    }
    if (specModal) specModal.classList.add('active');
  };

  window.calculateSavings = () => {
    const input = document.getElementById('calc-spend-input');
    const monthlyDisplay = document.getElementById('monthly-savings-num');
    const annualDisplay = document.getElementById('annual-savings-num');

    const spendLakhs = parseFloat(input?.value || 10);
    const monthlySavings = (spendLakhs * 100000 * 0.07);
    const annualSavings = monthlySavings * 12;

    if (monthlyDisplay) monthlyDisplay.textContent = `₹ ${monthlySavings.toLocaleString('en-IN')}`;
    if (annualDisplay) annualDisplay.textContent = `₹ ${annualSavings.toLocaleString('en-IN')}`;
  };


  // =========================================================================
  // 9. REQUISITION FORM SUBMISSION
  // =========================================================================
  window.handleFormSubmit = (event) => {
    event.preventDefault();

    const form = document.getElementById('requisition-form');
    const banner = document.getElementById('form-success-banner');
    const ticketText = document.getElementById('success-ticket-text');
    const submitBtn = document.getElementById('submit-btn');

    const name = document.getElementById('full-name')?.value;
    const randomTicket = Math.floor(1000 + Math.random() * 9000);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Requisition...';
    }

    setTimeout(() => {
      if (ticketText) {
        ticketText.textContent = `Thank you, ${name}! Ticket reference #GRH-${randomTicket} has been generated. Our national clinical manager will connect with your hospital within 2 hours.`;
      }

      if (banner) {
        banner.classList.add('active');
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (form) form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Submitted Successfully';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Requisition / Partner Inquiry';
        }
      }, 5000);
    }, 700);
  };

});
