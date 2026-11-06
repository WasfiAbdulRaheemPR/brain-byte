import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CivicConnect PostgreSQL database...');

  // 1. Seed Categories
  const categories = [
    {
      name: 'Roads & Infrastructure',
      description: 'Potholes, broken footpaths, road cracks, divider collapses, and hazardous street craters.',
      icon: 'Construction',
    },
    {
      name: 'Electrical & Streetlights',
      description: 'Damaged or unlit streetlights, exposed live wires, transformers, and electrical poles.',
      icon: 'Lightbulb',
    },
    {
      name: 'Waste Management',
      description: 'Overflowing public garbage bins, illegal dumping sites, animal waste, and uncollected trash.',
      icon: 'Trash2',
    },
    {
      name: 'Water Supply & Drainage',
      description: 'Drinking water pipeline leaks, contaminated supply, blocked storm drains, and sewage overflow.',
      icon: 'Droplets',
    },
    {
      name: 'Public Facilities',
      description: 'Damaged park benches, public toilets, bus stops, sidewalks, and community parks.',
      icon: 'Building2',
    },
    {
      name: 'General Community Issues',
      description: 'Encroachments, stray hazards, fallen tree branches, and miscellaneous civic issues.',
      icon: 'Layers',
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.name, record.id);
  }

  // 2. Seed Departments
  const departments = [
    {
      name: 'Roads and Infrastructure Department',
      description: 'Municipal roadway engineering, asphalt repairs, footpaths, and storm drains.',
      isActive: true,
    },
    {
      name: 'Electrical & Lighting Maintenance',
      description: 'Public illumination, streetlight grids, and low-voltage electrical safety.',
      isActive: true,
    },
    {
      name: 'Solid Waste Management & Sanitation',
      description: 'Municipal garbage collection, sanitation drives, recycling, and composting facilities.',
      isActive: true,
    },
    {
      name: 'Water Supply & Sewerage Board',
      description: 'Potable water pipelines, sewage treatment, storm drainage, and valve maintenance.',
      isActive: true,
    },
    {
      name: 'Public Works & Parks Maintenance',
      description: 'Civic amenities, municipal buildings, recreation parks, and community fixtures.',
      isActive: true,
    },
    {
      name: 'General Municipal Administration',
      description: 'Citizen grievance redressal, inter-department coordination, and civic compliance.',
      isActive: true,
    },
  ];

  const deptMap = new Map<string, string>();
  for (const dept of departments) {
    const record = await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
    deptMap.set(dept.name, record.id);
  }

  // 3. Seed Users
  const salt = await bcrypt.genSalt(10);
  const adminPassHash = await bcrypt.hash('AdminSecure2026!', salt);
  const citizenPassHash = await bcrypt.hash('CitizenSecure2026!', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@civicconnect.gov' },
    update: {},
    create: {
      fullName: 'Chief Municipal Officer (Admin)',
      email: 'admin@civicconnect.gov',
      phone: '+91 80 2297 5000',
      passwordHash: adminPassHash,
      role: 'ADMIN',
    },
  });

  const citizenUser = await prisma.user.upsert({
    where: { email: 'citizen@example.com' },
    update: {},
    create: {
      fullName: 'Aarav Sharma',
      email: 'citizen@example.com',
      phone: '+91 98765 43210',
      passwordHash: citizenPassHash,
      role: 'CITIZEN',
    },
  });

  // 4. Seed Complaints with Realistic Civic Scenarios
  const sampleComplaints = [
    {
      complaintNumber: 'CC-2026-000001',
      userId: citizenUser.id,
      categoryId: categoryMap.get('Roads & Infrastructure')!,
      departmentId: deptMap.get('Roads and Infrastructure Department')!,
      title: 'Deep Hazardous Pothole near 100ft Road Junction',
      description:
        'Large crater-sized pothole spanning approximately 1.5 meters across the left vehicular lane. Causing severe traffic congestion and poses serious safety risk to two-wheelers.',
      latitude: 12.9716,
      longitude: 77.5946,
      address: '100ft Road, Indiranagar, Bengaluru, Karnataka',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
    },
    {
      complaintNumber: 'CC-2026-000002',
      userId: citizenUser.id,
      categoryId: categoryMap.get('Electrical & Streetlights')!,
      departmentId: deptMap.get('Electrical & Lighting Maintenance')!,
      title: 'Non-Functional Streetlights in Residential Block 4',
      description:
        'A stretch of 6 consecutive streetlamps has been unlit for the past 4 nights. Road is completely dark creating security concerns for walking residents.',
      latitude: 12.9352,
      longitude: 77.6245,
      address: '4th Block, Koramangala, Bengaluru, Karnataka',
      status: 'UNDER_REVIEW' as const,
      priority: 'MEDIUM' as const,
    },
    {
      complaintNumber: 'CC-2026-000003',
      userId: citizenUser.id,
      categoryId: categoryMap.get('Waste Management')!,
      departmentId: deptMap.get('Solid Waste Management & Sanitation')!,
      title: 'Overflowing Municipal Dumpster near Public School',
      description:
        'Refuse has overflowed onto the pedestrian pavement outside St. Mary’s school gate. Emitting strong foul odor and attracting stray cattle.',
      latitude: 13.0358,
      longitude: 77.597,
      address: 'Bellary Road, Hebbal, Bengaluru, Karnataka',
      status: 'SUBMITTED' as const,
      priority: 'URGENT' as const,
    },
    {
      complaintNumber: 'CC-2026-000004',
      userId: citizenUser.id,
      categoryId: categoryMap.get('Water Supply & Drainage')!,
      departmentId: deptMap.get('Water Supply & Sewerage Board')!,
      title: 'Freshwater Main Pipe Burst and Submersion',
      description:
        'Underground potable water conduit burst creating geyser and flooding road corner. Drinking water wasted continuously for over 6 hours.',
      latitude: 12.9279,
      longitude: 77.6271,
      address: '5th Block, Jayanagar, Bengaluru, Karnataka',
      status: 'RESOLVED' as const,
      priority: 'URGENT' as const,
    },
  ];

  for (const c of sampleComplaints) {
    const complaint = await prisma.complaint.upsert({
      where: { complaintNumber: c.complaintNumber },
      update: {},
      create: c,
    });

    // Seed Status History
    await prisma.statusHistory.createMany({
      data: [
        {
          complaintId: complaint.id,
          previousStatus: null,
          newStatus: 'SUBMITTED',
          description: 'Initial submission logged in public ledger.',
          updatedById: citizenUser.id,
        },
      ],
      skipDuplicates: true,
    });

    // If resolved, add Resolution record and feedback
    if (c.status === 'RESOLVED') {
      await prisma.resolutionRecord.upsert({
        where: { complaintId: complaint.id },
        update: {},
        create: {
          complaintId: complaint.id,
          resolutionDescription:
            'Excavation team replaced 4-meter corroded steel junction pipe, fitted anti-surge valve, and recapped asphalt road surface.',
          resolvedById: adminUser.id,
        },
      });

      await prisma.feedback.create({
        data: {
          complaintId: complaint.id,
          userId: citizenUser.id,
          rating: 5,
          comments: 'Rapid turnaround by water board engineering squad. Excellent work!',
        },
      });
    }
  }

  console.log('✅ PostgreSQL seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

