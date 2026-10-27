import { Exercise } from '../types';

export const EXERCISES_DATABASE: Exercise[] = [
  // CHEST
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    targetMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    category: 'compound',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRestSeconds: 120,
    instructions: [
      'Lie flat on the bench with feet firmly planted on the floor.',
      'Grip the bar slightly wider than shoulder-width with wrists straight.',
      'Unrack the barbell and steady it directly over your chest with arms locked.',
      'Lower the bar slowly under control to your mid-chest while tucking elbows slightly (approx. 45 degrees).',
      'Press the bar explosively back to starting position without bouncing off the ribcage.'
    ],
    mistakesToAvoid: [
      'Flaring elbows out at 90 degrees which stresses the rotator cuff.',
      'Bouncing the bar off the sternum.',
      'Lifting hips and glutes off the bench.'
    ]
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    targetMuscle: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    category: 'compound',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
    instructions: [
      'Set an adjustable bench to an incline of 30 to 45 degrees.',
      'Kick dumbbells up to shoulder level as you lie back.',
      'Press dumbbells upward until arms are extended but not hyperextended.',
      'Lower weights smoothly until a deep stretch is felt in the upper chest, keeping elbows tucked.'
    ],
    mistakesToAvoid: [
      'Setting bench angle too high (>45 deg) which turns it into a shoulder press.',
      'Clanking dumbbells together at the top.'
    ]
  },
  {
    id: 'cable-chest-flye',
    name: 'Cable Chest Flye',
    targetMuscle: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    difficulty: 'beginner',
    category: 'isolation',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    instructions: [
      'Set cable pulleys at chest height with stirrup handles.',
      'Step forward into a staggered stance with slight forward torso lean.',
      'Bring handles together in a hugging arc with a soft bend in the elbows.',
      'Squeeze chest hard at peak contraction, then slowly open arms back to a stretch.'
    ],
    mistakesToAvoid: [
      'Bending and straightening elbows like a press instead of a flye.',
      'Using excessive body momentum.'
    ]
  },
  {
    id: 'push-up',
    name: 'Standard Push-Up',
    targetMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders', 'abs'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    category: 'compound',
    defaultSets: 3,
    defaultReps: '12-20',
    defaultRestSeconds: 60,
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulders.',
      'Engage glutes and core so body forms a straight line from heels to crown.',
      'Lower chest until 2-3 inches above the floor, keeping elbows at 45 degrees.',
      'Press through the floor back to the starting plank.'
    ],
    mistakesToAvoid: [
      'Sagging hips or piking hips in the air.',
      'Craning the neck forward.'
    ]
  },
  {
    id: 'dips-chest',
    name: 'Parallel Bar Dips',
    targetMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'advanced',
    category: 'compound',
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRestSeconds: 90,
    instructions: [
      'Grip the parallel dip bars and lift yourself to arm lockout.',
      'Lean torso forward 20-30 degrees and bend knees slightly.',
      'Lower body until elbows reach 90 degrees.',
      'Push firmly back up to full lockout focusing on lower chest contraction.'
    ],
    mistakesToAvoid: [
      'Dropping too deep causing anterior shoulder impingement.',
      'Staying upright which shifts tension strictly to triceps.'
    ]
  },

  // BACK
  {
    id: 'barbell-deadlift',
    name: 'Barbell Conventional Deadlift',
    targetMuscle: 'back',
    secondaryMuscles: ['legs', 'glutes', 'abs'],
    equipment: 'barbell',
    difficulty: 'advanced',
    category: 'compound',
    defaultSets: 4,
    defaultReps: '5',
    defaultRestSeconds: 150,
    instructions: [
      'Stand with feet hip-width apart, bar over midfoot, shins 1 inch away.',
      'Hinge at hips, grip the bar just outside knees with double overhand or mixed grip.',
      'Pull chest up, flatten lower back, engage lats (imagine squeezing oranges in armpits).',
      'Drive through midfoot and heels, extending hips and knees simultaneously to stand tall.'
    ],
    mistakesToAvoid: [
      'Rounding the lumbar spine under load.',
      'Letting the barbell drift forward away from the body.',
      'Hyperextending spine at lockout.'
    ]
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    targetMuscle: 'back',
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: 'cable',
    difficulty: 'beginner',
    category: 'compound',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    instructions: [
      'Sit comfortably under thigh pads with wide overhand grip on bar.',
      'Lean back very slightly (10-15 degrees) with chest lifted.',
      'Pull bar down to upper chest by driving elbows down and back.',
      'Control the ascent as arms extend back up into full lat stretch.'
    ],
    mistakesToAvoid: [
      'Swinging torso violently back and forth for momentum.',
      'Pulling the bar behind the neck.'
    ]
  },
  {
    id: 'barbell-bent-over-row',
    name: 'Barbell Bent-Over Row',
    targetMuscle: 'back',
    secondaryMuscles: ['biceps', 'shoulders', 'abs'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    category: 'compound',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
    instructions: [
      'Hinge at hips with knees slightly bent until torso is 45 degrees to the floor.',
      'Hold barbell with overhand grip slightly wider than shoulder width.',
      'Row the barbell up toward belly button, driving elbows up toward the ceiling.',
      'Squeeze shoulder blades together at the top, then lower bar smoothly.'
    ],
    mistakesToAvoid: [
      'Using hip jerk to launch weight upward.',
      'Rounding the thoracic and lumbar spine.'
    ]
  },
  {
    id: 'pull-up',
    name: 'Strict Pull-Up',
    targetMuscle: 'back',
    secondaryMuscles: ['biceps', 'abs'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    category: 'compound',
    defaultSets: 4,
    defaultReps: '6-10',
    defaultRestSeconds: 90,
    instructions: [
      'Hang from overhead bar with pronated (overhand) grip slightly wider than shoulder width.',
      'Depress scapulae, pull elbows down toward hips until chin clears the bar.',
      'Lower body under full control to a dead hang.'
    ],
    mistakesToAvoid: [
      'Kipping or swinging legs for momentum.',
      'Partial repetitions without full stretch at the bottom.'
    ]
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    targetMuscle: 'back',
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: 'cable',
    difficulty: 'beginner',
    category: 'compound',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    instructions: [
      'Sit with knees slightly bent, feet on footrests, grasp V-bar attachment.',
      'Sit upright with proud chest and neutral spine.',
      'Pull handle to lower abdomen, pinching scapulae together.',
      'Slowly release tension letting arms extend without collapsing your lower back.'
    ],
    mistakesToAvoid: [
      'Excessive backward torso rocking.',
      'Shrugging shoulders into the ears.'
    ]
  },

  // LEGS & GLUTES
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    targetMuscle: 'legs',
    secondaryMuscles: ['glutes', 'abs'],
    equipment: 'barbell',
    difficulty: 'advanced',
    category: 'compound',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRestSeconds: 120,
    instructions: [
      'Rest barbell securely across upper trapezius muscles with firm grip.',
      'Step back, feet shoulder-width apart with toes turned out 15-30 degrees.',
      'Inhale deep, brace core, and descend by breaking at hips and knees together.',
      'Squat until hip crease is below the top of the knee caps.',
      'Drive aggressively through the entire foot back to standing.'
    ],
    mistakesToAvoid: [
      'Knees collapsing inward (valgus collapse).',
      'Weight shifting to toes and heels rising.',
      'Rounding lower spine (butt wink under load).'
    ]
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    targetMuscle: 'glutes',
    secondaryMuscles: ['legs', 'back'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    category: 'compound',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
    instructions: [
      'Stand holding barbell at hip level with shoulder-width grip.',
      'Keep knees soft (slight bend) and push hips backward as if touching a wall behind you.',
      'Lower bar down shins until a deep hamstring stretch is felt, spine kept rigid.',
      'Drive hips forward and squeeze glutes to return to standing.'
    ],
    mistakesToAvoid: [
      'Squatting the weight rather than hinging at the hips.',
      'Bar drifting away from legs.'
    ]
  },
  {
    id: 'leg-press',
    name: '45° Incline Leg Press',
    targetMuscle: 'legs',
    secondaryMuscles: ['glutes'],
    equipment: 'machine',
    difficulty: 'beginner',
    category: 'compound',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
    instructions: [
      'Sit with back and head flat against backrest pad.',
      'Place feet shoulder-width on footplate at mid-height.',
      'Disengage safety levers and bend knees to lower sledge to 90 degree angle.',
      'Press through whole feet back to top without hyperextending knees.'
    ],
    mistakesToAvoid: [
      'Locking knees forcefully at top.',
      'Allowing lower back/pelvis to lift off backrest at the bottom.'
    ]
  },
  {
    id: 'walking-dumbbell-lunges',
    name: 'Walking Dumbbell Lunges',
    targetMuscle: 'legs',
    secondaryMuscles: ['glutes'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    category: 'compound',
    defaultSets: 3,
    defaultReps: '12 steps',
    defaultRestSeconds: 75,
    instructions: [
      'Hold a dumbbell in each hand at sides with torso upright.',
      'Take a comfortable stride forward, lowering back knee toward the floor.',
      'Front thigh should be parallel to floor and knee tracking over toes.',
      'Push off front heel directly into the next forward step.'
    ],
    mistakesToAvoid: [
      'Slamming back knee hard onto the floor.',
      'Torso leaning excessively forward.'
    ]
  },
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    targetMuscle: 'legs',
    secondaryMuscles: [],
    equipment: 'machine',
    difficulty: 'beginner',
    category: 'isolation',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    instructions: [
      'Place balls of feet on platform with heels hanging off.',
      'Lower heels as far as comfortably possible into a deep stretch.',
      'Press through big toes to elevate heels as high as possible, pausing for 1 second.'
    ],
    mistakesToAvoid: [
      'Bouncing rapidly without pausing at stretch and contraction.',
      'Bending knees to initiate movement.'
    ]
  },

  // SHOULDERS
  {
    id: 'overhead-press',
    name: 'Barbell Overhead Press (OHP)',
    targetMuscle: 'shoulders',
    secondaryMuscles: ['triceps', 'abs'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    category: 'compound',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRestSeconds: 90,
    instructions: [
      'Grip barbell just outside shoulder width with bar resting on front deltoids and clavicle.',
      'Brace core and glutes, tilt head slightly back to clear chin.',
      'Press barbell straight up overhead, moving head forward under bar once cleared.',
      'Lock out overhead with bar centered over midfoot and shoulder joint.'
    ],
    mistakesToAvoid: [
      'Excessive backward arch in the lower spine.',
      'Pushing bar forward in a curved loop instead of straight vertical path.'
    ]
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    targetMuscle: 'shoulders',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    category: 'isolation',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    instructions: [
      'Stand holding dumbbells at sides with slight forward torso tilt.',
      'Raise arms out to sides in the scapular plane (slight angle forward).',
      'Lift until dumbbells reach shoulder height with elbows slightly bent.',
      'Lower weights smoothly under control.'
    ],
    mistakesToAvoid: [
      'Using body momentum / shrugging traps to heave weights up.',
      'Lifting pinky lower than thumb (keep knuckles flat or pinky slightly elevated).'
    ]
  },
  {
    id: 'cable-face-pull',
    name: 'Cable Face Pull',
    targetMuscle: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: 'cable',
    difficulty: 'beginner',
    category: 'isolation',
    defaultSets: 3,
    defaultReps: '15-20',
    defaultRestSeconds: 60,
    instructions: [
      'Set cable pulley to upper chest height with rope attachment.',
      'Grip rope ends with thumbs pointing backward.',
      'Pull rope toward face, separating hands and rotating wrists backward.',
      'Elbows should finish high and wide, squeezing rear deltoids and rotators.'
    ],
    mistakesToAvoid: [
      'Setting weight too heavy and pulling with lower back.',
      'Failing to externally rotate at finish.'
    ]
  },

  // ARMS: BICEPS & TRICEPS
  {
    id: 'barbell-bicep-curl',
    name: 'Barbell Bicep Curl',
    targetMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: 'barbell',
    difficulty: 'beginner',
    category: 'isolation',
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRestSeconds: 60,
    instructions: [
      'Stand upright holding barbell with underhand shoulder-width grip.',
      'Pin elbows tight against sides.',
      'Curl weight upward contracting biceps until forearms are near vertical.',
      'Lower slowly back to full elbow extension without swinging hips.'
    ],
    mistakesToAvoid: [
      'Swinging hips forward to bounce bar upward.',
      'Allowing elbows to drift forward excessively.'
    ]
  },
  {
    id: 'incline-dumbbell-curl',
    name: 'Incline Dumbbell Curl',
    targetMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    category: 'isolation',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 60,
    instructions: [
      'Sit on an incline bench angled at 45-60 degrees.',
      'Let arms hang straight down behind torso with dumbbells.',
      'Curl dumbbells up while keeping upper arms pointed down toward floor.',
      'Squeeze biceps at the top, then lower fully to get a deep long-head stretch.'
    ],
    mistakesToAvoid: [
      'Pulling elbows forward during the curl.',
      'Lifting head off the incline pad.'
    ]
  },
  {
    id: 'triceps-rope-pushdown',
    name: 'Cable Triceps Rope Pushdown',
    targetMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: 'cable',
    difficulty: 'beginner',
    category: 'isolation',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 60,
    instructions: [
      'Attach rope to high pulley, grasp ends with neutral grip.',
      'Pin elbows beside ribcage, hinge slightly at hips.',
      'Push rope downward until elbows are fully locked out, flaring rope ends outward.',
      'Control the return until forearms reach parallel with floor.'
    ],
    mistakesToAvoid: [
      'Elbows flaring and moving forwards and backwards.',
      'Using shoulder press movement instead of elbow extension.'
    ]
  },
  {
    id: 'skull-crusher',
    name: 'EZ-Bar Skull Crusher (Lying Triceps Extension)',
    targetMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: 'barbell',
    difficulty: 'intermediate',
    category: 'isolation',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    instructions: [
      'Lie flat on bench holding EZ curl bar directly over chest with arms extended.',
      'Angle upper arms slightly back toward your head (around 70 degrees).',
      'Bend elbows to lower bar smoothly toward forehead or crown of head.',
      'Extend elbows back to starting position focusing on triceps contraction.'
    ],
    mistakesToAvoid: [
      'Flaring elbows out sideways.',
      'Dropping weight rapidly toward the face.'
    ]
  },

  // ABS & CORE
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg / Knee Raise',
    targetMuscle: 'abs',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    category: 'isolation',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    instructions: [
      'Hang from pull-up bar with overhand grip and dead hang.',
      'Curl pelvis upward and raise legs (or knees) until parallel with floor.',
      'Focus on tilting pelvis toward ribs rather than swinging hip flexors.',
      'Lower slowly without swinging body.'
    ],
    mistakesToAvoid: [
      'Swinging legs like a pendulum.',
      'Arching lower back on descent.'
    ]
  },
  {
    id: 'ab-wheel-rollout',
    name: 'Ab Wheel Rollout',
    targetMuscle: 'abs',
    secondaryMuscles: ['shoulders', 'back'],
    equipment: 'other',
    difficulty: 'advanced',
    category: 'isolation',
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRestSeconds: 75,
    instructions: [
      'Kneel on a soft mat holding ab wheel with both hands under shoulders.',
      'Round upper back slightly and brace core as if taking a punch.',
      'Roll wheel forward smoothly as far as you can maintain a neutral, non-sagging spine.',
      'Pull wheel back toward knees using core and lats.'
    ],
    mistakesToAvoid: [
      'Letting hips sag down toward the floor, pinching lumbar spine.',
      'Sitting back on heels before completing repetition.'
    ]
  },
  {
    id: 'plank-hold',
    name: 'Forearm Plank Hold',
    targetMuscle: 'abs',
    secondaryMuscles: ['shoulders', 'glutes'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    category: 'isolation',
    defaultSets: 3,
    defaultReps: '45-60s',
    defaultRestSeconds: 60,
    instructions: [
      'Place forearms on floor with elbows directly under shoulders.',
      'Extend legs behind with toes tucked on floor.',
      'Squeeze glutes, quadriceps, and abdominal wall tightly.',
      'Hold position while breathing rhythmically through belly.'
    ],
    mistakesToAvoid: [
      'Holding breath.',
      'Dropping lower back into excessive lumbar extension.'
    ]
  }
];
